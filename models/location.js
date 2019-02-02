const Joi = require('joi');
const mongoose = require('mongoose');

const Location = mongoose.model('Location', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isActive: {
        type: Boolean,
        default: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true,
    }
}));

function validateOwner(location) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isActive: Joi.boolean(),
        company: Joi.ObjectId()
            .required()

    };

    return Joi.validate(location, schema);
}

exports.Location = Location;
exports.validate = validateOwner;