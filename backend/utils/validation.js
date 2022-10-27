const { validationResult } = require('express-validator')
const { check } = require('express-validator')

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req)

    if(!validationErrors.isEmpty()){
        const errors = validationErrors
                        .array()
                        .map(error => `${error.msg}`)

        const err = Error('Bad request.')
        err.errors = errors
        err.status = 400
        err.title = 'Bad request.'
        next(err)
    }

    next()
}

const validateAddVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('lat')
        .exists({ checkFalsy: true})
        .isFloat()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true})
        .isFloat()
        .withMessage('Longitude is not valid'),
    handleValidationErrors
]

module.exports = {
    handleValidationErrors,
    validateAddVenue
}
