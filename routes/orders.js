const { Order, validate } = require("../models/order");
// const { Movie } = require("../models/movie");
// const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

// Fawn.init(mongoose);

router.get("/", auth, async (req, res) => {
  const orders = await Order.find()
    .select("-__v")
    .sort("-dateOut");
  res.send(orders);
});

// router.post("/", auth, async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const customer = await Customer.findById(req.body.customerId);
//   if (!customer) return res.status(400).send("Invalid customer.");

//   const movie = await Movie.findById(req.body.movieId);
//   if (!movie) return res.status(400).send("Invalid movie.");

//   if (movie.numberInStock === 0)
//     return res.status(400).send("Movie not in stock.");

//   let order = new Order({
//     customer: {
//       _id: customer._id,
//       name: customer.name,
//       phone: customer.phone
//     },
//     movie: {
//       _id: movie._id,
//       title: movie.title,
//       dailyOrderRate: movie.dailyOrderRate
//     }
//   });

//   try {
//     new Fawn.Task()
//       .save("orders", order)
//       .update(
//         "movies",
//         { _id: movie._id },
//         {
//           $inc: { numberInStock: -1 }
//         }
//       )
//       .run();

//     res.send(order);
//   } catch (ex) {
//     res.status(500).send("Something failed.");
//   }
// });

// router.get("/:id", [auth], async (req, res) => {
//   const order = await Order.findById(req.params.id).select("-__v");

//   if (!order)
//     return res.status(404).send("The order with the given ID was not found.");

//   res.send(order);
// });

module.exports = router;
