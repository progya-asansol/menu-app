const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
    },
  ],
  total: Number,
  customer: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);