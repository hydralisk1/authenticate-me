const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth')
const { User } = require('../../db/models')

const router = express.Router()

router.get('/', restoreUser, (req, res) => {
    const { user } = req

    return user ? res.json({ user: user.toSafeObject() }) : res.json({})
})

router.post('/', async (req, res, next) => {
    const { credential, password } = req.body
    const user = await User.login({ credential, password })

    if(!user) {
        const err = new Error('Login failed')
        err.status = 401
        err.title = 'Login failed'
        err.errors = ['The provided credentials were invalid.']
        return next(err)
    }

    setTokenCookie(res, user)

    return res.json({ user })
})

router.delete('/', (_req, res) => {
    res.clearCookie('token')
    return res.json({ message: 'success' })
})

module.exports = router
