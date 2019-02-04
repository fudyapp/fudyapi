const Joi = require('joi');
const mongoose = require('mongoose');

const Company = mongoose.model('Company', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isActive: {
        type: Boolean,
        default: true
    }
}));

function validateOwner(company) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isActive: Joi.boolean()
    };

    return Joi.validate(company, schema);
}

exports.Company = Company;
exports.validate = validateOwner;