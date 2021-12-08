const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  items: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
