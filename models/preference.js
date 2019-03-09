const Joi = require('joi');
const mongoose = require('mongoose');

const userPreference = mongoose.model('userPreference', new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    }
}).pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
}));

function validateUserPreference(userPreference) {
    const schema = {
        location:  Joi.objectId().required(),
        user: Joi.objectId().required(),
        company:  Joi.objectId().required()
    };
    return Joi.validate(userPreference, schema);
}

exports.userPreference = userPreference;
exports.validate = validateUserPreference;