const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')
const { Op } = require('sequelize')
const { User, Group, Membership } = require('../db/models')

const { secret, expiresIn } = jwtConfig

const setTokenCookie = (res, user) => {
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) }
    )

    const isProduction = process.env.NODE_ENV === 'production'

    res.cookie('token', token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && 'Lax'
    })

    return token
}

const restoreUser = (req, res, next) => {
    const { token } = req.cookies
    req.user = null

    return jwt.verify(token, secret, null, async(err, jwtPayload) => {
        if(err) return next()

        try {
            const { id } = jwtPayload.data
            req.user = await User.scope('currentUser').findByPk(id)
        }catch (err) {
            res.clearCookie('token')
            return next()
        }

        if(!req.user) res.clearCookie('token')

        return next()
    })
}

const requireAuth = (req, _res, next) => {
    if(req.user) return next()

    const err = new Error('Unauthorized')
    err.title = 'Unauthorized'
    err.errors = ['Unauthorized']
    err.status = 401
    return next(err)
}

const requireGroupAuth = async (req, _res, next) => {
    const { groupId } = req.params
    const userId = req.user.id
    const group = await Group.findByPk(groupId)

    if(!group) {
        const err = new Error('Group couldn\'n t be found')
        err.title = 'Group couldn\'n t be found'
        err.errors = ['Group couldn\'n t be found']
        err.status = 404
        return next(err)
    }

    if(group.organizerId === userId) return next()

    const membership = await Membership.findOne({
        where: {
            [Op.and]: [
                { groupId },
                {[Op.and]: [
                    { userId },
                    { status: 'co-host'}
                ]}
            ]
        }
    })

    if(membership) return next()

    const err = new Error('Unauthorized')
    err.title = 'Unauthorized'
    err.errors = ['Unauthorized']
    err.status = 401

    return next(err)
}

module.exports = {
    setTokenCookie,
    restoreUser,
    requireAuth,
    requireGroupAuth
}
