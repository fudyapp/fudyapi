const config = require("config");
const {User} = require('../models/user');
const mongoose = require('mongoose');

module.exports = async function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  // if (!config.get("requiresAuth")) return next();

  // if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  let user = await User.findOne({ _id: req.user._id });
  if(user){
   return  next();
  }else{
    return res.status(403).send("Access denied.");
  }
};
