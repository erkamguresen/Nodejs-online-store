const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    // minLength: 5,
    // maxLength: 255,
    // trim: true,
    // lowercase: true,
  },
  price: {
    type: Number,
    required: function () {
      return this.isActive;
    },
    min: 0,
    max: 10000,
    // get: (value) => Math.round(value), // when getting value from db
    // set: (value) => Math.round(value), // when setting value to db
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
  assetId: {
    type: String,
    required: true,
  },
  // tags: {
  //   type: Array,
  //   validate: {
  //     validator: function (value) {
  //       return value && value.length > 0;
  //     },
  //     message: 'A product must have at least one tag.',
  //   },
  // },
});

module.exports = mongoose.model('Product', productSchema); //db collection is automatically 'products'
