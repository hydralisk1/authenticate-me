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

const validateCreateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60, min: 1})
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type')
        .exists({ checkFalsy: true })
        .custom(value => ['Online', 'In person'].includes(value))
        .withMessage('Type must be a boolean'),
    check('city')
        .exists({ checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true})
        .withMessage('State is required'),
    handleValidationErrors
]

const validateAddImage = [
    check('url')
        .exists({ checkFalsy: true })
        .isURL()
        .withMessage('url should be url type'),
    check('preview')
        .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage('Preview should be a boolean value'),
    handleValidationErrors
]

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

const validateAddEvent = [
    check('venueId')
        .exists()
        .withMessage('Venue does not exist'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 character'),
    check('type')
        .exists({ checkFalsy: true })
        .custom(value => ['Online', 'In person'].includes(value))
        .withMessage('Type must be Online or In person'),
    check('price')
        .exists({ checkFalsy: true})
        .isFloat()
        .withMessage('Price is invalid'),
    check('description')
        .exists({ checkFalsy: true})
        .withMessage('Description is required'),
    check('startDate')
        .exists({ checkFalsy: true})
        .isAfter()
        .withMessage('Start date must be in the future'),
    check('endDate')
        .exists({ checkFalsy: true})
        .custom((endDate, { req }) => new Date(endDate) > new Date(req.body.startDate))
        // .isAfter('startDate')
        .withMessage('End date is less than start date'),
    handleValidationErrors
]

module.exports = {
    handleValidationErrors,
    validateAddVenue,
    validateCreateGroup,
    validateAddImage,
    validateAddEvent
}
