const express = require('express')
const { ValidationError } = require('sequelize')
const { Attendance, Event, Group, Venue, User, EventImage, sequelize } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')
const { validateAddImage, validateAddEvent } = require('../../utils/validation')
const router = express.Router()

router.get('/:eventId/attendees', async (req, res, next) => {
    const attendees = await Event.findByPk(req.params.eventId, {
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
            through: {
                attributes: ['status']
            }
        },
        attributes: []
    })

    if(!attendees) {
        const err = new Error('Event couldn\'t be found')
        err.status = 404

        return next(err)
    }

    return res.json({ Attendees: attendees.Users })
})

router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.id
    const { eventId } = req.params

    const event = await Event.findByPk(eventId, {
        include: [{
            model: Group,
            include: {
                model: User,
                as: 'Members',
                where: { id: currentUserId },
                required: false
            }
        },{
            model: User,
            through: {
                attributes: ['status']
            },
            where: { id: currentUserId },
            required: false,
        }]
    })

    if(!event) {
        const err = new Error('Event couldn\'t be found')
        err.status = 404

        return next(err)
    }

    // if(!event.Group.Members.length || event.Group.Members[0].Membership.status === 'pending') {
    if(!event.Group.Members.length) {
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
    }

    if(event.Users.length){
        const err = new Error()
        err.status = 400

        if(event.Users[0].Attendance.status === 'pending')
            err.message = 'Attendance has already been requested'
        else err.message = 'User is already an attendee of the event'

        return next(err)
    }

    const newAttendance = await Attendance.create({
        eventId,
        userId: currentUserId,
        status: 'pending'
    })

    return res.json({
        id: newAttendance.id,
        userId: newAttendance.userId,
        status: newAttendance.status
    })
})

router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const { eventId } = req.params
    const { userId, status } = req.body

    if(!userId || !status) {
        const err = new Error('userId and status are required')
        err.status = 400

        return next(err)
    }

    if(status === 'pending'){
        const err = new Error('Cannot change an attendance status to pending')
        err.status = 400

        return next(err)
    }

    const user = await Event.findByPk(eventId, {
        include: [{
            model: User,
            through:{
                attributes: ['status']
            },
            where: { id: userId },
            required: false
        },{
            model: Group,
            attributes: ['organizerId'],
            include: [{
                model: User,
                as: 'Members',
                through: {
                    attributes: ['id', 'status']
                }
            }]
        }]
    })

    if(!user){
        const err = new Error('Event couldn\'t be found')
        err.status = 404

        return next(err)
    }

    if(!user.Users.length){
        const err = new Error('Attendance between the user and the event does not exist')
        err.status = 404

        return next(err)
    }

    const currentUserId = req.user.id

    if(currentUserId !== user.Group.organizerId
        && !user.Group.Members.some(member => member.id === currentUserId && member.Membership.status === 'co-host'
        && status === 'member'
    )
    ){
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
    }

    const event = await User.findByPk(userId, {
        include: {
            model: Event,
            through: {
                where: { eventId }
            }
        }
    })

    await event.Events[0].Attendance.update({ status })

    return res.json(event.Events[0].Attendance)
})

router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
    if(!req.body.userId) {
        const err = new ValidationError('Validation Error')
        err.message = 'userId is required'
        err.status = 400

        return next(err)
    }
    const event = await Event.findByPk(req.params.eventId, {
        include: [{
            model: Group,
        },{
            model: User,
            where: {
                id: req.body.userId
            },
            required: false
        }]
    })

    if(!event){
        const err = new Error('Event couldn\'t be found')
        err.status = 404

        return next(err)
    }

    if(!event.Users.length){
        const err = new Error('Attendance does not exist for this User')
        err.status = 404

        return next(err)
    }

    if(req.user.id !== event.Group.organizerId && req.user.id !== req.body.userId){
        const err = new Error('Only the User or organizer may delete an Attendance')
        err.status = 403

        return next(err)
    }

    await event.Users[0].Attendance.destroy()

    return res.json({ message: 'Successfully deleted attendance from event' })
})

router.post('/:eventId/images', requireAuth, validateAddImage, async (req, res, next) => {
    const { eventId } = req.params
    const user = await Event.findByPk(eventId, {
        include: [{
            model: User,
            through:{
                attributes: ['status']
            }
        },{
            model: Group,
            attributes: ['organizerId'],
            include: [{
                model: User,
                as: 'Members',
                through: {
                    attributes: ['status']
                }
            }]
        }]
    })

    if(!user){
        const err = new Error('Event couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const userId = req.user.id

    if(userId !== user.Group.organizerId
        && !user.Group.Members.some(member => member.id === userId && member.Membership.status === 'co-host')
        && !user.Users.some(attendee => attendee.id === userId && attendee.Attendance.status === 'member')
    ){
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
    }

    const { url, preview } = req.body

    const newImage = await EventImage.create({
        eventId,
        url,
        preview
    })

    return res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})

router.put('/:eventId', requireAuth, validateAddEvent, async (req, res, next) => {
    const { eventId } = req.params
    const event = await Event.findByPk(eventId, {
        include: {
            model: Group,
            include: {
                model: User,
                as: 'Members'
            }
        }
    })

    if(!event) {
        const err = new Error('Event couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const userId = req.user.id

    if(event.Group.organizerId !== userId
        && !event.Group.Members.some(member => member.id === userId && member.Membership.status === 'co-host')
    ){
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
    }

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    const venue = await Venue.findByPk(venueId)
    if(!venue) {
        const err = new Error('Venue couldn\'t be found')
        err.status = 404

        return next(err)
    }

    await event.update({
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
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate
    })
})

router.delete('/:eventId', requireAuth, async (req, res, next) => {
    const { eventId } = req.params
    const event = await Event.findByPk(eventId, {
        include: {
            model: Group,
            include: {
                model: User,
                as: 'Members'
            }
        }
    })

    if(!event) {
        const err = new Error('Event couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const userId = req.user.id

    if(event.Group.organizerId !== userId
        && !event.Group.Members.some(member => member.id === userId && member.Membership.status === 'co-host')
    ){
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
    }

    await event.destroy()

    return res.json({ message: 'Successfully deleted' })
})

router.get('/:eventId', async (req, res, next) => {
    const event = await Event.scope('detail').findByPk(req.params.eventId, {
        include: [{
            model: Group,
            attributes: ['id', 'name', 'private', 'city', 'state']
        },{
            model: Venue,
        },{
            model: EventImage
        },{
            model: User,
        }],
    })

    if(!event || !event.id){
        const err = new Error('Event couldn\'t be found')
        err.status

        return next(err)
    }

    const data = await event.toJSON()
    data.numAttending = data.Users.length
    delete data.Users

    return res.json(data)
})

router.get('/', async (req, res) => {
    let { page, size, name, type, startDate } = req.query
    const where = {}

    page = !page || isNaN(page) || page < 1 ? 1 : page > 10 ? 10 : parseInt(page)
    size = !size || isNaN(size) || size < 1 || size > 20 ? 20 : parseInt(size)

    const limit = size
    const offset = (page - 1) * size

    if(name) where.name = name
    if(type) where.type = type
    if(startDate) where.startDate = startDate

    const events = await Event.findAll({
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
        where,
        limit,
        offset,
        subQuery: false
    })

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

module.exports = router
