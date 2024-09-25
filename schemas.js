// server side validation on the models. require joi and use joi schema and export modeule to use elsehwere
const Joi = require('joi');
module.exports.campgroundJoiSchema = Joi.object({
        campground: Joi.object({
            tittle: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),
        }).required()
    })

// server side validtion on the review schema using joi

module.exports.reviewJoiSchema =  Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),

    }).required()
})




