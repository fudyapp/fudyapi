const config = require("config");
const {Admin} = require('../models/admin');
const mongoose = require('mongoose');

module.exports = async function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  // if (!config.get("requiresAuth")) return next();

  // if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  let admin = await Admin.findOne({ _id: req.user._id });
  if(admin.role === "admin" || admin.role === "sadmin"){
   return  next();
  }else{
    return res.status(403).send("Access denied.");
  }
};
