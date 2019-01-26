const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: {
    type:String,
    required:true,
    unique:true
  },
  firstName:String,
  lastName:String,
  phone:{
    type:String,
    maxlength: 12,
    minlength:10
  },
  hash: String,
  salt: String,
  role:{
    type:String,
    enum:['admin','cashier','vendor','sadmin','user'],
    default:'user'
  }
});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    role:this.role,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'fudy123456secret');
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    firstName:this.firstName,
    lastName:this.lastName,
    phone:this.phone,
    token: this.generateJWT(),
  };
};
UsersSchema.methods.toUserJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    firstName:this.firstName,
    lastName:this.lastName,
    phone:this.phone,
  };
};

mongoose.model('Users', UsersSchema);