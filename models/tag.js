const Joi = require('joi');
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Tag = mongoose.model('Tag', tagSchema);

function validateGenre(tag) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(tag, schema);
}

exports.tagSchema = tagSchema;
exports.Tag = Tag; 
exports.validate = validateGenre;