const {
     validate,userPreference
} = require("../models/preference");
const {
    User
} = require("../models/user");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const canCreate = require("../middleware/canCreate");

router.get("/", auth, async (req, res) => {
    const preferences = await userPreference.find()
        .select("-__v")
        .populate({
            path: 'user',
            model: 'User',
            select: {
                'name': 1,
                'phone': 1,
                "_id": 0
            },
        }).populate({
            path:'location',
            model:"Location",
            select: {
                'name': 1,
                "_id": 0
            },
        }).populate({
            path:'company',
            model:"Company",
            select: {
                'name': 1,
                "_id": 0
            },
        });
    res.send(preferences);
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
    let IsPreference = await userPreference.findOne({
        user: req.body.user
    });
    if (IsPreference) return res.status(400).send("Preference exists for user.");
    let preference = new userPreference({
        company: req.body.company,
        location: req.body.location,
        user: req.body.user
    });
    preference = await preference.save();

    res.send(preference);
});

router.put("/:id", [auth, canCreate], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const Preference = await userPreference.findByIdAndUpdate(
        req.params.id, {
            company: req.body.company,
            location: req.body.location,
            user: req.body.user
        }, {
            new: true
        }
    );

    if (!Preference)
        return res
            .status(404)
            .send("The Preference with the given ID was not found.");

    res.send(Preference);
});

router.delete("/:id", [auth, canCreate], async (req, res) => {
    const Preference = await userPreference.findOneAndDelete(req.params.id);

    if (!Preference)
        return res
            .status(404)
            .send("The Preference with the given ID was not found.");

    res.send(Preference);
});

router.get("/:id", [auth, canCreate], async (req, res) => {
    const Preference = await userPreference.findOne({
        _id: req.params.id
    }).select("-__v")        .populate({
        path: 'user',
        model: 'User',
        select: {
            'name': 1,
            'phone': 1,
            "_id": 0
        },
    }).populate({
        path:'location',
        model:"Location",
        select: {
            'name': 1,
            "_id": 0
        },
    }).populate({
        path:'company',
        model:"Company",
        select: {
            'name': 1,
            "_id": 0
        },
    });

    if (!Preference)
        return res
            .status(404)
            .send("The Preference with the given ID was not found.");

    res.send(Preference);
});
router.get("/user/:id", [auth, canCreate], async (req, res) => {
    const Preference = await userPreference.findOne({
        user: req.params.id
    }).select("-__v")        .populate({
        path: 'user',
        model: 'User',
        select: {
            'name': 1,
            'phone': 1,
            "_id": 0
        },
    }).populate({
        path:'location',
        model:"Location",
        select: {
            'name': 1,
            "_id": 0
        },
    }).populate({
        path:'company',
        model:"Company",
        select: {
            'name': 1,
            "_id": 0
        },
    });

    if (!Preference)
        return res
            .status(404)
            .send("The Preference with the given ID was not found.");

    res.send(Preference);
});

module.exports = router;