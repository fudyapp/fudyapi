const { Owner, validate } = require("../models/owner");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const canCreate = require("../middleware/canCreate");

router.get("/", auth, async (req, res) => {
  const owners = await Owner.find()
    .select("-__v")
    .sort("name");
  res.send(owners);
});

router.post("/", [auth, canCreate], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let IsOwner = await Owner.findOne({ name: req.body.name });
  if (IsOwner) return res.status(400).send("Company already Exists.");
  let owner = new Owner({
    name: req.body.name,
    isActive: req.body.isActive,
    phone: req.body.phone
  });
  owner = await owner.save();

  res.send(owner);
});

router.put("/:id", [auth, canCreate], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const owner = await Owner.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isActive: req.body.isActive,
      phone: req.body.phone
    },
    { new: true }
  );

  if (!owner)
    return res
      .status(404)
      .send("The owner with the given ID was not found.");

  res.send(owner);
});

router.delete("/:id", [auth, canCreate], async (req, res) => {
  const owner = await Owner.findByIdAndRemove(req.params.id);

  if (!owner)
    return res
      .status(404)
      .send("The owner with the given ID was not found.");

  res.send(owner);
});

router.get("/:id", [auth, canCreate], async (req, res) => {
  const owner = await Owner.findById(req.params.id).select("-__v");

  if (!owner)
    return res
      .status(404)
      .send("The owner with the given ID was not found.");

  res.send(owner);
});

module.exports = router;
