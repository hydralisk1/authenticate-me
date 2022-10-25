const express = require('express')
const { Group, GroupImage, User, sequelize } = require('../../db/models')

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

module.exports = router
