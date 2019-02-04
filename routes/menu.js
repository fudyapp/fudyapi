const { Menu, validate } = require("../models/menu");
const { Tag } = require("../models/tag");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const menuItems = await Menu.find()
    .select("-__v")
    .sort("name");
  res.send(menuItems);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tag = await Tag.findById(req.body.tags);
  if (!tag) return res.status(400).send("Invalid tag.");

  const menu = new Menu({
    name: req.body.name,
    tags: req.body.tags,
    numberInStock: req.body.numberInStock,
    price: req.body.price,
    vendor: req.body.vendor
  });
  await menu.save();

  res.send(menu);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tag = await Tag.findById(req.body.tags);
  if (!tag) return res.status(400).send("Invalid tag.");

  const menu = await Menu.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      tags: req.body.tags,
      numberInStock: req.body.numberInStock,
      price: req.body.price
    },
    { new: true }
  );

  if (!menu)
    return res.status(404).send("The menu with the given ID was not found.");

  res.send(menu);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const menu = await Menu.findByIdAndRemove(req.params.id);

  if (!menu)
    return res.status(404).send("The menu with the given ID was not found.");

  res.send(menu);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const menu = await Menu.findById(req.params.id).select("-__v");

  if (!menu)
    return res.status(404).send("The menu with the given ID was not found.");

  res.send(menu);
});

module.exports = router;
