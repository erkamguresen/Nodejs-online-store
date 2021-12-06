const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  description: String,
  imageURL: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema); //db collection is automatically 'products'
