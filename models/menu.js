const Joi = require('joi');
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
  }
});

const Menu = mongoose.model('MenuItems', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  tags: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'company',
    }],
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 10000
  },
  image: {
    type: String,
    minlength: 5,
    maxlength: 255

  },
  vendor:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'vendor',
    required: true,
  }
}));

function validateMenu(menu) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    tags: Joi.array().min(1).items(Joi.objectId()).required(),
    numberInStock: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().min(5).max(50).required(),
    vendor: Joi.objectId()
    .required()
  };

  return Joi.validate(menu, schema);
}

exports.Menu = Menu;
exports.validate = validateMenu;