const joi = require("joi");
const Listing = require("./models/listing");

module.exports.listingschema = joi.object({
    Listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(500),
        image: joi.string().allow("",null),
        location: joi.string().required(),
        country: joi.string().required(),

    }).required
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
});