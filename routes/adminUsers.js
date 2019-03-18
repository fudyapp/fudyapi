const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const canCreate = require("../middleware/canCreate");
const sadmin = require("../middleware/sadmin");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  Admin,
  validate,
  validateEdit,
  ValidateRole,
  validateSadmin
} = require("../models/admin");
const express = require("express");
const router = express.Router();


//for admin user details
router.get("/me", auth, async (req, res) => {
  const user = await Admin.findById(req.user._id).select("-password").populate('owner').populate('company').populate('manager').populate('location');
  res.send(user);
});

router.get("/all", auth, async (req, res) => {
  const users = await Admin.find({
      'role': {
        $in: ['admin', 'vendor', 'cashier']
      }
    })
    .select(["-__v", "-password"])
    .sort("name").populate('location').populate('owner').populate('company').populate('manager');
  res.send(users);
});
// router.get("/vendors", auth, async (req, res) => {
//   const users = await Admin.find({
//       'role': {
//         $in: ['vendor']
//       }
//     })
//     .select(["-__v", "-password"])
//     .sort("name").populate('location').populate('owner').populate('company').populate('manager');
//   res.send(users);
// });
router.get("/vendors", auth, async (req, res) => {
  let filter = null;
  if (req.query.location) {
    filter = {
      'role': {
        $in: ['vendor']
      },
      'location': req.query.location

    }
  } else {
    filter = {
      'role': {
        $in: ['vendor']
      }
    }
  }
  const users = await Admin.find(filter)
    .select(["-__v", "-password"])
    .sort("name").populate('location').populate('owner').populate('company').populate('manager');
  res.send(users);
});
router.get("/cashiers", auth, async (req, res) => {
  let filter = null;
  if (req.query.location) {
    filter = {
      'role': {
        $in: ['cashier']
      },
      'location': req.query.location

    }
  } else {
    filter = {
      'role': {
        $in: ['cashier']
      }
    }
  }
  const users = await Admin.find(filter)
    .select(["-__v", "-password"])
    .sort("name").populate('location').populate('owner').populate('company').populate('manager');
  res.send(users);
});
router.get("/admins/:id", auth, async (req, res) => {
  const users = await Admin.find({
      'role': {
        $in: ['admin']
      },
      'company': req.params.id
    })
    .select(["-__v", "-password"])
    .sort("name").populate('location').populate('owner').populate('company').populate('manager');
  res.send(users);
});
router.get("/roles", auth, async (req, res) => {
  // const users = await Admin.find({'role':{$in:['admin','vendor','cashier']}})
  //   .select(["-__v","-password"])
  //   .sort("name").populate('location').populate('owner').populate('company').populate('manager');
  const roles = ['admin', 'vendor', 'cashier']
  res.send(roles);
});

router.post("/", async (req, res) => {
  const {
    error
  } = validateSadmin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Admin.findOne({
    phone: req.body.phone
  });
  if (user) return res.status(400).send("User already registered.");

  user = new Admin(_.pick(req.body, ["name", "password", "phone", "role"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "phone", "owner", "company"]));
});

router.post("/createadmin", [auth, sadmin], async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Admin.findOne({
    phone: req.body.phone
  });
  if (user) return res.status(400).send("User already registered.");

  user = new Admin(_.pick(req.body, ["name", "password", "phone", "role", "owner", "company", "location", 'manager', 'isActive']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "phone", "owner", "company"]));
});

router.post("/create", [auth, canCreate], async (req, res) => {
  const {
    error
  } = ValidateRole(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Admin.findOne({
    phone: req.body.phone
  });
  if (user) return res.status(400).send("User already registered.");

  user = new Admin(_.pick(req.body, ["name", "password", "phone", "role", "owner", "company", "manager", "location", 'isActive']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "phone", "owner", "company"]));
});

router.get("/user/:id", [auth, canCreate, validateObjectId], async (req, res) => {
  const user = await Admin.findById(req.params.id).populate({
    path: 'owner',
    model: 'Owner'
  }).populate({
    path: 'company',
    model: 'Company'
  }).populate({
    path: 'manager',
    model: 'admin',
    select: {
      'name': 1,
      'phone': 1,
      "_id": 0
    },
  })
  res.send(user);
});

router.put("/edit/:id", [auth, canCreate, validateObjectId], async (req, res) => {
  const {
    error
  } = validateEdit(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // let user = await Admin.findOneAndUpdate({ _id: req.params.id },_.pick(req.body, ["name"]));
  // if (user)  {res.send(_.pick(user, ["_id", "name","phone"]));}
  let isUser = await Admin.findOne({
    phone: req.body.phone
  });
  if (isUser) return res.status(400).send("User already registered.");
  const user = await Admin.findByIdAndUpdate(
    req.params.id,
    req.body, {
      new: true
    }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(_.pick(user, ["_id", "name", "phone"]));
});
router.delete("/delete/:id", [auth, canCreate, validateObjectId], async (req, res) => {
  if (req.user._id !== req.params.id) {
    const user = await Admin.findByIdAndUpdate(req.params.id, {

      isActive: false
    }, {
      new: true
    });
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");

    res.send(user);
  } else {
    return res.status(404).send("invalid operation");
  }

});

module.exports = router;
