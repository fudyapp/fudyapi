const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  role: {
    type: String,
    enum: ['admin', 'cashier', 'vendor', 'sadmin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'owner',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'manager'
   
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
      _id: this._id,
      name: this.name,
      phone: this.phone
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("admin", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(10)
      .max(10)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    role: Joi.string()
      .valid('admin', 'cashier', 'vendor', 'sadmin'),
    owner: Joi.objectId()
      .required(),
    company: Joi.objectId()
      .required()
  };

  return Joi.validate(user, schema);
}

function validateEdit(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required()
  };

  return Joi.validate(user, schema);
}

function ValidateRole(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(10)
      .max(10)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    role: Joi.string()
      .valid('cashier', 'vendor')
      .required(),
    owner: Joi.objectId()
      .required(),
    company: Joi.objectId()
      .required(),
      manager: Joi.objectId()
      .required()
  }
  return Joi.validate(user, schema);
};

exports.Admin = User;
exports.validate = validateUser;
exports.validateEdit = validateEdit;
exports.ValidateRole = ValidateRole;
