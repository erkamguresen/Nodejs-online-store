const mongoose = require('mongoose');
const Product = require('../models/product');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const updatedCartItems = [...this.cart.items];

  const index = updatedCartItems.findIndex(
    (cartProduct) => cartProduct.productId.toString() === product._id.toString()
  );

  if (index >= 0) {
    updatedCartItems[index].quantity++;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }

  this.cart = { items: updatedCartItems };

  return this.save();
};

userSchema.methods.getCart = function () {
  const productIds = this.cart.items.map((item) => item.productId);

  return Product.find({ _id: { $in: productIds } })
    .select('name price imageURL')
    .then((products) => {
      return products.map((product) => ({
        name: product.name,
        price: product.price,
        imageURL: product.imageURL,
        quantity: this.cart.items.find(
          (item) => item.productId.toString() === product._id.toString()
        ).quantity,
      }));
    })
    .catch((err) => console.log(err));
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  this.cart = { items: updatedCartItems };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
