const router = require('express').Router()
const sessionRouter = require('./session.js')
const usersRouter = require('./users.js')
const groupRouter = require('./groups.js')
const groupImageRouter = require('./group-images.js')
const venueRouter = require('./venues.js')
const eventRouter = require('./events.js')
const eventImageRouter = require('./event-images.js')
const { restoreUser } = require('../../utils/auth.js')

router.use(restoreUser)

router.use('/session', sessionRouter)
router.use('/users', usersRouter)
router.use('/groups', groupRouter)
router.use('/group-images', groupImageRouter)
router.use('/venues', venueRouter)
router.use('/events', eventRouter)
router.use('/event-images', eventImageRouter)

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body })
})

module.exports = router
