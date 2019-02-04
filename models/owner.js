const Joi = require('joi');
const mongoose = require('mongoose');

const Owner = mongoose.model('Owner', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isActive: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

function validateOwner(owner) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isActive: Joi.boolean()
    };

    return Joi.validate(owner, schema);
}

exports.Owner = Owner;
exports.validate = validateOwner;