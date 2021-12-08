const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);
