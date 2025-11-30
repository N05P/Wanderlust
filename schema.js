const joi = require('joi');

module.exports.checkSchema = joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.number().required().min(500),
        location:joi.string().required(),
        country:joi.string().required(),
        image:joi.string().allow("",null)
    }).required()
})

module.exports.checkReviews = joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string()
    }).required()
})