const express = require('express')
const { Group, GroupImage, User, Venue, Membership, sequelize } = require('../../db/models')
const { Op } = require('sequelize')
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

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
