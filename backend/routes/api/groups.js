const express = require('express')
const { Group, GroupImage, User, sequelize, Venue } = require('../../db/models')

const router = express.Router()

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

        next(err)
    }

    const numMembers = await group.countMembers()

    const data = await group.toJSON()
    data.numMembers = numMembers

    return res.json(data)
})

module.exports = router
