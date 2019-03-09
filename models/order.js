const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      price: {
        type: Number,
        required: true,
        min: 0,
        max: 10000
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
      }

    })],
    required: true
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateDelivered: {
    type: Date
  },
  orderTotal: {
    type: Number,
    min: 0,
    required: true,
  },
  totalItems: {
    type: Number,
    min: 0,
    required: true,
  }
});

orderSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  });
}

orderSchema.methods.deliver = function () {
  this.dateDelivered = new Date();

  const orderDays = moment().diff(this.dateOut, 'days');
  this.orderFee = orderDays * this.movie.dailyOrderRate;
}

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
  const schema = {
    customer: Joi.objectId().required(),
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;