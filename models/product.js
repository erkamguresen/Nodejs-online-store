const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  price: {
    type: Number,
    required: function () {
      return this.isActive;
    },
    min: 0,
    max: 10000,
  },
  description: { type: String, minLength: 5, maxLength: 2000 },
  imageURL: String,
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: Boolean,
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
});

module.exports = mongoose.model('Product', productSchema); //db collection is automatically 'products'
