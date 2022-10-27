const express = require('express')
const { requireAuth, requireGroupAuth } = require('../../utils/auth')
const { GroupImage, Group } = require('../../db/models')

const router = express.Router()

router.delete('/:imageId', requireAuth, requireGroupAuth, async (req, res, next) => {
    const image = await GroupImage.findByPk(req.params.imageId)

    if(!image){
        const err = new Error('Group Image couldn\'t be found')
        err.status = 404

        return next(err)
    }

    await image.destroy()

    return res.json({
        message: 'Successfully deleted',
        statusCode: 200
    })
})


module.exports = router
