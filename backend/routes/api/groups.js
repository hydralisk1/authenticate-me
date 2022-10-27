const express = require('express')
const { Group, GroupImage, User, Venue, Membership, sequelize } = require('../../db/models')
const { Op, ValidationError } = require('sequelize')
const { requireAuth, requireGroupAuth } = require('../../utils/auth')
const { check } = require('express-validator')
const { handleValidationErrors, validateAddVenue } = require('../../utils/validation')

const router = express.Router()

const validateCreateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60, min: 1})
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type')
        .exists({ checkFalsy: true })
        .custom(value => ['Online', 'In person'].includes(value))
        .withMessage('Type must be a boolean'),
    check('city')
        .exists({ checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true})
        .withMessage('State is required'),
    handleValidationErrors
]

const validateAddImage = [
    check('url')
        .exists({ checkFalsy: true })
        .isURL()
        .withMessage('url should be url type'),
    check('preview')
        .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage('Preview should be a boolean value'),
    handleValidationErrors
]

router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { groupId } = req.params
    const { memberId } = req.body

    const group = await Group.findByPk(groupId)
    if(!group){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const user = await User.findByPk(memberId, {
        include: {
            model: Group,
            as: 'JoinedGroups',
            where: { id: groupId },
            required: false
        }
    })

    if(!user) {
        const err = new ValidationError('Validation Error')
        err.errors = { memberId: 'User couldn\'t be found'}
        err.status = 400

        return next(err)
    }

    if(!user.JoinedGroups.length) {
        const err = new Error('Membership does not exist for this User')
        err.status = 404

        return next(err)
    }

    const joinedGroup = user.JoinedGroups[0].Membership

    console.log(joinedGroup)

    if(req.user.id !== group.organizerId && memberId !== req.user.id){
        const err = new Error(`Permission denied`)
        err.status = 403

        return next(err)
    }

    joinedGroup.destroy()

    return res.json({ message: 'Successfully deleted membership from group' })
})

router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const { groupId } = req.params
    const { memberId, status } = req.body

    if(status === 'pending'){
        const err = new ValidationError('Cannot change a membership status to pending')
        err.status = 400

        return next(err)
    }

    const group = await Group.findByPk(groupId)

    if(!group){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const user = await User.findByPk(memberId)

    if(!user){
        const err = new ValidationError('User couldn\'t be found')
        err.status = 400

        return next(err)
    }

    const member = await user.getJoinedGroups({
        where: { id: groupId },
        attributes: [],
    })

    if(!member.length){
        const err = new Error('Membership between the user and the group does not exists')
        err.status = 400

        return next(err)
    }

    let role

    if(group.organizerId === userId) role = 'organizer'
    else {
        const currentUser = await group.getMemberships({
            where: { userId }
        })

        if(currentUser.length) role = currentUser[0].status
    }

    if((role !== 'organizer' && role !== 'co-host') || (status === 'co-host' && role !== 'organizer')){
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
    }

    await member[0].Membership.update({
        status
    })

    return res.json({
        id: member[0].Membership.id, // id doesn't appear
        groupId: member[0].Membership.groupId,
        memberId: member[0].Membership.userId,
        status: member[0].Membership.status,
    })
})

router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { groupId } = req.params

    const group = await Group.findByPk(groupId)

    if(!group){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const userId = req.user.id

    const memberships = await group.getMemberships({
        where: {
            userId
        }
    })

    if(memberships.length){
        const err = new Error()

        if(memberships.status === 'pending')
            err.message = 'Membership has already been requested'
        else err.message = 'User is already a member of the group'

        err.status = 400

        return next(err)
    }

    const newMember = await Membership.create({
        userId,
        groupId,
        status: 'pending'
    })

    return res.json({
        memberId: newMember.userId,
        status: newMember.status
    })
})

router.get('/:groupId/members', async (req, res, next) => {
    const { groupId } = req.params
    const where = {}
    const member = await Group.findByPk(groupId)

    if(!req.user || req.user.id !== member.organizerId){
        where.status = { [Op.in]: ['co-host', 'member']}
    }

    const members = await Group.findByPk(groupId, {
        include: [{
            model: User,
            as: 'Members',
            attributes: ['id', 'firstName', 'lastName'],
            through: {
                attributes: ['status'],
                where
            },
        }],
        attributes: []
    })

    if(!members.length) {
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    return res.json(members)
})

router.post('/:groupId/images', requireAuth, validateAddImage, async (req, res, next) => {
    const { groupId } = req.params
    const group = await Group.findByPk(groupId)

    if(!group || group.organizerId !== req.user.id){
        const err = new Error()
        err.status = 404
        err.message = 'Group couldn\'t be found'

        next(err)
    }

    const { url, preview } = req.body

    const groupImage = await GroupImage.create({
        groupId,
        url,
        preview
    })

    return res.json({
        id: groupImage.id,
        url: groupImage.url,
        preview: groupImage.preview
    })
})

router.get('/:groupId/venues', requireAuth, requireGroupAuth, async (req, res) => {
    const { groupId } = req.params
    const venues = await Venue.findAll({ where: { groupId } })

    return res.json({ Venues: venues })
})

router.post('/:groupId/venues', requireAuth, requireGroupAuth, validateAddVenue, async (req, res) => {
    const { groupId } = req.params
    const { address, city, state, lat, lng } = req.body

    const newVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng
    })

    return res.status(201).json({
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        lat: newVenue.lat,
        lng: newVenue.lng,
    })
})

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const gIds = await Membership.findAll({
        attributes: ['groupId'],
        where: { userId }
    })

    const groupIds = gIds.map(g => g.groupId)

    const groups = await Group.findAll({
        include: [{
            model: Membership,
            attributes: [],
        },{
            model: GroupImage,
            attributes: [],
            where: { preview: true },
            required: false, // LEFT OUTER JOIN
        }],
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('Memberships.userId')), 'numMembers'],
                [sequelize.col('GroupImages.url'), 'previewImage']
            ]
        },
        where: {
            [Op.or]: [{
                '$Memberships.groupId$': { [Op.in]: groupIds}
            },{
                organizerId: userId
            }]
        },
        group: ['Group.id']
    })

    return res.json({ Groups: groups })
})

router.get('/:groupId', async (req, res, next) => {
    const { groupId } = req.params

    const group = await Group.findByPk(groupId, {
        include: [{
            model: GroupImage,
            attributes: ['id', 'url', 'preview']
        },{
            model: User,
            as: 'Organizer',
            attributes: ['id', 'firstName', 'lastName']
        },{
            model: Venue,
            attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        }],
    })

    if(!group){
        const err = new Error()
        err.message = 'Group couldn\'t be found'
        err.status = 404

        return next(err)
    }

    const numMembers = await group.countMembers()

    const data = await group.toJSON()
    data.numMembers = numMembers

    return res.json(data)
})

router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const { groupId } = req.params

    const group = await Group.findByPk(groupId)

    if(!group || group.organizerId !== req.user.id){
        const err = new Error()
        err.status = 404
        err.message = 'Group couldn\'t be found'

        next(err)
    }

    await group.destroy()

    return res.json({
        message: 'Successfully deleted',
        statusCode: 200
    })
})

router.put('/:groupId', requireAuth, validateCreateGroup, async (req, res, next) => {
    const { groupId } = req.params

    const group = await Group.findByPk(groupId)

    if(!group || req.user.id !== group.organizerId){
        const err = new Error()
        err.status = 404
        err.message = 'Group couldn\'t be found'

        next(err)
    }

    const { name, about, type, private, city, state } = req.body
    group.set({
        name,
        about,
        type,
        private,
        city,
        state
    })

    await group.save()

    return res.json(group)
})

router.get('/', async (_req, res) => {
    const groups = await Group.findAll({
        include: [{
            model: User,
            as: 'Members',
            attributes: []
        },{
            model: GroupImage,
            attributes: [],
            required: false,
            where: {
                preview: true
            }
        }],
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('Members.id')), 'numMembers'],
                [sequelize.col('GroupImages.url'), 'previewImage']
            ]
        },
        group: ['Group.id'],
        order: [['id']]
    })

    return res.json({ Groups: groups })
})

router.post('/', requireAuth, validateCreateGroup, async (req, res, next) => {
    const organizerId = req.user.id
    const { name, about, type, private, city, state } = req.body

    try{
        const newGroup = await Group.create({
            organizerId,
            name,
            about,
            type,
            private,
            city,
            state,
        })

        return res.status(201).json(newGroup)
    }catch(err){
        err.status = 400
        next(err)
    }
})

module.exports = router
