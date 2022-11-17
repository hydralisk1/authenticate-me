const express = require('express')
const { Group, GroupImage, User, Venue, Membership, Event, EventImage, sequelize } = require('../../db/models')
const { Op, ValidationError } = require('sequelize')
const { requireAuth } = require('../../utils/auth')
const { validateAddVenue, validateCreateGroup, validateAddImage, validateAddEvent } = require('../../utils/validation')

const router = express.Router()

const checkGroupAuth = (currentUser, userId) => {
    if(currentUser.organizerId === userId) return true
    if(!currentUser.Members.length) return false
    if(currentUser.Members[0].Membership.status === 'co-host') return true
    return false
}

router.post('/:groupId/events', requireAuth, validateAddEvent, async (req, res, next) => {
    const { groupId } = req.params
    const currentUser = await Group.findByPk(groupId, {
        include: [{
            model: User,
            as: 'Members',
            where: { id: req.user.id },
            through: {
                attributes: ['status']
            },
            required: false
        }, {
            model: Event,
            include: {
                model: User,
                through: {
                    attributes: ['status']
                }
            }
        }]
    })

    if(!currentUser){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    if(!checkGroupAuth(currentUser, req.user.id)) {
        const err = new Error('Permision denied')
        err.status = 403

        return next(err)
    }

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    if(venueId){
        const venue = await Venue.findByPk(venueId)
        if(!venue){
            const err = new Error('Venue couldn\'t be found')
            err.status = 404

            return next(err)
        }
    }

    const newEvent = await Event.create({
        groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    })

    return res.json({
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
    })
})

router.get('/:groupId/events', async (req, res, next) => {
    const { groupId } = req.params

    const events = await Event.findAll({
        where: { groupId },
        include: [{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },{
            model: Venue,
            attributes: ['id', 'city', 'state']
        },{
            model: User,
        },{
            model: EventImage,
            where: { preview: true },
            required: false
        }],
    })

    if(!events.length){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const data = events.map(event => {
        const obj = {}

        obj.id = event.id
        obj.groupId = event.groupId
        obj.venueId = event.venueId
        obj.name = event.name
        obj.type = event.type
        obj.startDate = event.startDate
        obj.endDate = event.endDate
        obj.numAttending = event.Users.length
        if(event.EventImages.length) obj.previewImage = event.EventImages[0].url
        else obj.previewImage = null
        obj.Group = event.Group
        obj.Venue = event.Venue

        return obj
    })

    return res.json({ Events: data })
})

router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { groupId } = req.params
    const { memberId } = req.body

    if(!memberId) {
        const err = new ValidationError('Validation Error')
        err.status = 400
        err.errors = ['memberId is required']

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

    const group = await Group.findByPk(groupId, {
        include: [{
            model: User,
            as: 'Members',
            through: { attributes: ['id'] },
            where: { id: memberId },
            required: false,
        }]
    })

    if(!group){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    if(!group.Members.length){
        const err = new Error('Membership does not exist for this User')
        err.status = 404

        return next(err)
    }

    if(req.user.id !== group.organizerId && memberId !== req.user.id){
        const err = new Error(`Permission denied`)
        err.status = 403

        return next(err)
    }

    await group.Members[0].Membership.destroy()

    return res.json({ message: 'Successfully deleted membership from group' })
})

router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const { groupId } = req.params
    const { memberId, status } = req.body

    if(memberId === null || !status){
        const err = new ValidationError('Validation Error')
        err.status = 400

        err.errors = ['memberId and status are reqruied']

        return next(err)
    }

    if(status === 'pending'){
        const err = new ValidationError('Cannot change a membership status to pending')
        err.status = 400

        return next(err)
    }

    const group = await Group.findByPk(groupId, {
        include: {
            model: User,
            as: 'Members',
            through: { attributes: ['id', 'status'] },
            required: false
        }
    })
    if(!group){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    if(memberId === group.organizerId){
        const err = new Error('You are the organizer')
        err.status = 400

        return next(err)
    }

    if(!group.Members.length){
        const err = new ValidationError('Validation Error')
        err.status = 400

        return next(err)
    }

    let currUserIdx
    let memberIdx

    for(let i = 0; i < group.Members.length; i++){
        if(group.Members[i].id === memberId) memberIdx = i
        else if(group.Members[i].id === userId) currUserIdx = i
    }

    if(memberIdx === undefined){
        const err = new Error('Membership between the user and the group does not exists')
        err.status = 404

        return next(err)
    }

    const changingStatus = group.Members[memberIdx].Membership.status

    if(userId === group.organizerId
        || (currUserIdx !== undefined && group.Members[currUserIdx].Membership.status === 'co-host' && changingStatus === 'member'))
    {
        const membership = await group.Members[memberIdx].Membership.update({ status })

        return res.json({
            id: membership.id,
            groupId: membership.groupId,
            memberId: membership.userId,
            status: membership.status,
        })
    }

    const err = new Error('Permission denied')
        err.status = 403

        return next(err)
})

router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { groupId } = req.params

    const group = await Group.findByPk(groupId, {
        include: [{
            model: User,
            as: 'Members',
            through: {
                attributes: ['status']
            }
        }]
    })

    if(!group){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    let idx

    if(group.Members.some((member, i) => {
        if(member.id === req.user.id) {
            idx = i
            return true
        }
        return false
    })){
        const err = new Error()
        err.status = 400

        if(group.Members[idx].Membership.status === 'pending') err.message = 'Membership has already been requested'
        else err.message = 'User is already a member of the group'

        return next(err)
    }

    const newMember = await Membership.create({
        groupId,
        userId: req.user.id,
        status: 'pending'
    })

    return res.json({
        id: newMember.id,
        memberId: newMember.userId,
        status: newMember.status
    })
})

router.get('/:groupId/members', async (req, res, next) => {
    const { groupId } = req.params
    const where = {}
    const member = await Group.findByPk(groupId)

    if(!member) {
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

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
                where,
                required: false
            },
            required: false
        }],
        attributes: []
    })

    return res.json(members)
})

router.post('/:groupId/images', requireAuth, validateAddImage, async (req, res, next) => {
    const { groupId } = req.params
    const group = await Group.findByPk(groupId)

    if(!group){
        const err = new Error()
        err.status = 404
        err.message = 'Group couldn\'t be found'

        next(err)
    }

    if(group.organizerId !== req.user.id){
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
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

router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { groupId } = req.params
    const currentUser = await Group.findByPk(groupId, {
        include: {
            model: User,
            as: 'Members',
            where: { id: req.user.id },
            through: {
                attributes: ['status']
            },
            required: false
        }
    })

    if(!currentUser){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    if(!checkGroupAuth(currentUser, req.user.id)) {
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
    }

    const venues = await Venue.findAll({ where: { groupId } })

    return res.json({ Venues: venues })
})

router.post('/:groupId/venues', requireAuth, validateAddVenue, async (req, res, next) => {
    const { groupId } = req.params
    const currentUser = await Group.findByPk(groupId, {
        include: [{
            model: User,
            as: 'Members',
            where: { id: req.user.id },
            through: {
                attributes: ['status']
            },
            required: false,
        }]
    })

    if(!currentUser){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    if(!checkGroupAuth(currentUser, req.user.id)) {
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
    }

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

    const group = await User.findByPk(userId, {
        include: [{
            model: Group,
            as: 'JoinedGroups',
            include: [{
                model: User,
                as: 'Members',
            },{
                model: GroupImage,
                attributes: ['url'],
                where: { preview: true },
                required: false,
            }],
        },{
            model: Group,
            as: 'OrganizedGroups',
            include: [{
                model: User,
                as: 'Members',
            },{
                model: GroupImage,
                where: { preview: true },
                required: false,
            }],
        }],
        attributes: [],
    })

    const currentGroups = [...group.JoinedGroups, ...group.OrganizedGroups].map(d => {
        const groups = {}

        groups.id = d.id
        groups.organizerId = d.organizerId
        groups.name = d.name
        groups.about = d.about
        groups.type = d.type
        groups.private = d.private
        groups.city = d.city
        groups.state = d.state
        groups.createdAt = d.createdAt
        groups.updatedAt = d.updatedAt
        groups.numMembers = d.Members.length
        if(d.GroupImages.length) {
            groups.previewImage = d.GroupImages[0].url
        }
        else groups.previewImage = null

        return groups
    })

    return res.json({ Groups: currentGroups })
})

router.get('/:groupId', async (req, res, next) => {
    const { groupId } = req.params

    const group = await Group.findByPk(groupId, {
        include: [{
            model: GroupImage,
            attributes: ['id', 'url', 'preview'],
        },{
            model: User,
            as: 'Organizer',
            attributes: ['id', 'firstName', 'lastName'],
        },{
            model: Venue,
            attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        },{
            model: User,
            as: 'Members',
        }],
    })

    if(!group || !group.id){
        const err = new Error()
        err.message = 'Group couldn\'t be found'
        err.status = 404

        return next(err)
    }

    const converted = await group.toJSON()
    converted.numMembers = converted.Members.length
    delete converted.Members

    return res.json(converted)
})

router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const { groupId } = req.params

    const group = await Group.findByPk(groupId)

    if(!group){
        const err = new Error()
        err.status = 404
        err.message = 'Group couldn\'t be found'

        next(err)
    }

    if(req.user.id !== group.organizerId){
        const err = new Error('Forbidden')
        err.status = 403

        return next(err)
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

    if(!group){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        next(err)
    }

    if(req.user.id !== group.organizerId){
        const err = new Error('Forbidden')
        err.status = 403

        return next(err)
    }

    const { name, about, type, private, city, state } = req.body
    await group.update({
        name,
        about,
        type,
        private,
        city,
        state
    })

    return res.json(group)
})

router.get('/', async (_req, res) => {
    const groups = await Group.findAll({
        include: [{
            model: User,
            as: 'Members'
        },{
            model: GroupImage,
            where: { preview: 'true'},
            required: false
        }]
    })

    const data = groups.map(group => {
        const obj = {}

        obj.id = group.id
        obj.organizerId = group.organizerId
        obj.name = group.name
        obj.about = group.about
        obj.type = group.type
        obj.private = group.private
        obj.city = group.city
        obj.state = group.state
        obj.createdAt = group.createdAt
        obj.updatedAt = group.updatedAt
        obj.numMembers = group.Members.length
        if(group.GroupImages.length) obj.previewImage = group.GroupImages[0].url
        else obj.previewImage = null

        return obj
    })

    return res.json(data)
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
