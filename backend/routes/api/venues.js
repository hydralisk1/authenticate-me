const express = require('express')
const { requireAuth, requireGroupAuth } = require('../../utils/auth')
const { validateAddVenue } = require('../../utils/validation')
const { Venue, Group } = require('../../db/models')
const router = express.Router()

router.put('/:venueId', requireAuth, requireGroupAuth, validateAddVenue, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body

    const venue = await Venue.findByPk(req.params.venueId, {
        include: Group
    })

    if(!venue){
        const err = new Error('Venue couldn\'t be found')
        err.status = 404

        return next(err)
    }

    const groupId = venue.Group.id

    venue.update({
        groupId,
        address,
        city,
        state,
        lat,
        lng
    })

    res.json({
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng
    })
})

module.exports = router
