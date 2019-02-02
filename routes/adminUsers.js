const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const canCreate = require("../middleware/canCreate");
const sadmin = require("../middleware/sadmin");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Admin, validate,validateEdit,ValidateRole } = require("../models/admin");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await Admin.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Admin.findOne({ phone: req.body.phone });
  if (user) return res.status(400).send("User already registered.");

  user = new Admin(_.pick(req.body, ["name", "password","phone","role","owner","company"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name","phone","owner","company"]));
});

router.post("/createadmin", [auth, sadmin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Admin.findOne({ phone: req.body.phone });
  if (user) return res.status(400).send("User already registered.");

  user = new Admin(_.pick(req.body, ["name", "password","phone","role","owner","company"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name","phone","owner","company"]));
});

router.post("/create", [auth, canCreate], async (req, res) => {
  const { error } = ValidateRole(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Admin.findOne({ phone: req.body.phone });
  if (user) return res.status(400).send("User already registered.");

  user = new Admin(_.pick(req.body, ["name", "password","phone","role","owner","company"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name","phone","owner","company"]));
});

router.put("/edit/:id", [auth, canCreate,validateObjectId], async (req, res) => {
  const { error } = validateEdit(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // let user = await Admin.findOneAndUpdate({ _id: req.params.id },_.pick(req.body, ["name"]));
  // if (user)  {res.send(_.pick(user, ["_id", "name","phone"]));}
  const user = await Admin.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true
    }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(_.pick(user, ["_id", "name","phone"]));
});
router.delete("/delete/:id", [auth, canCreate,validateObjectId], async (req, res) => {
  if(req.user._id !==req.params.id){
  const user = await Admin.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
  }else{
    return res.status(404).send("invalid operation");
  }
  
});

module.exports = router;
