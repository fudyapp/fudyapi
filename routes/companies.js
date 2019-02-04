const { Company, validate } = require("../models/company");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const canCreate = require("../middleware/canCreate");

router.get("/", [auth, canCreate, validateObjectId], async (req, res) => {
  const company = await Company.find()
    .select("-__v")
    .sort("name");
  res.send(company);
});
router.get("/:id", [auth, canCreate, validateObjectId], async (req, res) => {
  const company = await Company.findById({"_id":req.params.id})
    .select("-__v")
    .sort("name");
  res.send(company);
});

router.post("/", [auth, canCreate], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let company = new Company({
    name: req.body.name,
    isActive: req.body.isActive
  });
  company = await company.save();

  res.send(company);
});

router.put("/:id", [auth, canCreate], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const company = await Company.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isActive: req.body.isActive
    },
    { new: true }
  );

  if (!company)
    return res
      .status(404)
      .send("The company with the given ID was not found.");

  res.send(company);
});

router.delete("/:id", [auth, canCreate], async (req, res) => {
  const company = await Company.findByIdAndRemove(req.params.id);

  if (!company)
    return res
      .status(404)
      .send("The company with the given ID was not found.");

  res.send(company);
});

router.get("/:id", [auth, canCreate], async (req, res) => {
  const company = await Company.findById(req.params.id).select("-__v");

  if (!company)
    return res
      .status(404)
      .send("The company with the given ID was not found.");

  res.send(company);
});

module.exports = router;
