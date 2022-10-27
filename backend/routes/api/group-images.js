const express = require('express')
const { requireAuth } = require('../../utils/auth')
const { User, GroupImage, Group } = require('../../db/models')

const router = express.Router()

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const image = await GroupImage.findByPk(req.params.imageId)

    if(!image){
        const err = new Error('Group Image couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const groupId = image.groupId

    const user = await Group.findByPk(groupId, {
        include: [{
            model: User,
            as: 'Members',
            through:{
                attributes: ['status']
            }
        }]
    })

    if(!user){
        const err = new Error('Group couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const userId = req.user.id

    if(userId !== user.organizerId
        && !user.Members.some(member => member.id === userId && member.Membership.status === 'co-host')
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
