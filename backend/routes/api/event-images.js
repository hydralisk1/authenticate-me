const express = require('express')
const router = express.Router()
const { User, Group, Event, EventImage } =require('../../db/models')
const { requireAuth } = require('../../utils/auth')

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params
    const image = await EventImage.findByPk(imageId, {
        include: [{
            model: Event,
            include: [{
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
        }]
    })

    if(!image){
        const err = new Error('Event Image couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const userId = req.user.id

    if(userId !== image.Event.Group.organizerId
        && !image.Event.Group.Members.some(member => userId === member.id && member.Membership.status === 'co-host')
    ){
        const err = new Error('Permission denied')
        err.status = 403

        return next(err)
    }

    await image.destroy()

    return res.json({
        message: 'Successfully deleted',
        statusCode: 200
    })
})

module.exports = router
