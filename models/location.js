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
        ref: 'Company',
        required: true,
    }
}).pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
      this.created_at = now;
    }
    next();
  }));

function validateLocation(location) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isActive: Joi.boolean(),
        company: Joi.objectId()
            .required()

    };

    return Joi.validate(location, schema);
}

exports.Location = Location;
exports.validate = validateLocation;