const { Location, validate } = require("../models/location");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const canCreate = require("../middleware/canCreate");

router.get("/", auth, async (req, res) => {
  const location = await Location.find()
    .select("-__v")
    .sort("name");
  res.send(location);
});

router.get("/:id", [auth, canCreate, validateObjectId], async (req, res) => {
  const location = await Location.findById({"_id":req.params.id})
    .select("-__v")
    .sort("name");
  res.send(location);
});

router.post("/", [auth, canCreate], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let location = new Location({
    name: req.body.name,
    isActive: req.body.isActive,
    company: req.body.company
  });
  location = await location.save();

  res.send(location);
});

router.put("/:id", [auth, canCreate], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const location = await Location.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isActive: req.body.isActive
    },
    { new: true }
  );

  if (!location)
    return res
      .status(404)
      .send("The location with the given ID was not found.");

  res.send(location);
});

router.delete("/:id", [auth, canCreate], async (req, res) => {
  const location = await Location.findByIdAndRemove(req.params.id);

  if (!location)
    return res
      .status(404)
      .send("The location with the given ID was not found.");

  res.send(location);
});

router.get("/:id", [auth, canCreate], async (req, res) => {
  const location = await Location.findById(req.params.id).select("-__v");

  if (!location)
    return res
      .status(404)
      .send("The location with the given ID was not found.");

  res.send(location);
});

module.exports = router;
