const express = require('express')
const { Group, GroupImage, User, Venue, Membership, sequelize } = require('../../db/models')
const { Op } = require('sequelize')
const { requireAuth } = require('../../utils/auth')

const router = express.Router()

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
            required: false,
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

module.exports = router
