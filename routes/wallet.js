const {
  Wallet,
  validate,validateWalletUpdate
} = require("../models/wallet");
const {
  User
} = require("../models/user");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const canCreate = require("../middleware/canCreate");

router.get("/", auth, async (req, res) => {
  const wallets = await Wallet.find()
    .select("-__v")
    .sort("amount").populate({
      path: 'user',
      model: 'User',
      select: {
        'name': 1,
        'phone': 1,
        "_id": 0
      },
    })
  res.send(wallets);
});

router.post("/", [auth, canCreate], async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let IsUser = await User.findOne({
    _id: req.body.user
  });
  if (!IsUser) return res.status(400).send("User not exist.");
  let IsWallet = await Wallet.findOne({
    user: req.body.user
  });
  if (IsWallet) return res.status(400).send("wallet exists for user.");
  let wallet = new Wallet({
    amount: req.body.amount,
    isActive: req.body.isActive,
    user: req.body.user
  });
  wallet = await wallet.save();

  res.send(wallet);
});

router.put("/:id", [auth, canCreate], async (req, res) => {
  const {
    error
  } = validateWalletUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const wallet = await Wallet.findByIdAndUpdate(
    req.params.id, {
      amount: req.body.amount,
      isActive: req.body.isActive,
    }, {
      new: true
    }
  );

  if (!wallet)
    return res
      .status(404)
      .send("The wallet with the given ID was not found.");

  res.send(wallet);
});

router.delete("/:id", [auth, canCreate], async (req, res) => {
  const wallet = await Wallet.findOneAndDelete(req.params.id);

  if (!wallet)
    return res
      .status(404)
      .send("The wallet with the given ID was not found.");

  res.send(wallet);
});

router.get("/:id", [auth, canCreate], async (req, res) => {
  const wallet = await Wallet.findOne({
    _id: req.params.id
  }).select("-__v");

  if (!wallet)
    return res
      .status(404)
      .send("The wallet with the given ID was not found.");

  res.send(wallet);
});
router.get("/user/:id", [auth, canCreate], async (req, res) => {
  const wallet = await Wallet.findOne({
    user: req.params.id
  }).select("-__v");

  if (!wallet)
    return res
      .status(404)
      .send("The wallet with the given ID was not found.");

  res.send(wallet);
});

module.exports = router;
