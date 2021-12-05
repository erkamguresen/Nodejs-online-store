const getDb = require('../utilities/database').getDb;
const mongodb = require('mongodb');

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart ? cart : {};
    this.cart.items = this.cart.items ? this.cart.items : [];
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDb();
    return db.collection('Users').insertOne(this);
  }

  getCart() {
    const ids = this.cart.items.map((i) => i.productId);

    const db = getDb();
    return db
      .collection('products')
      .find({ _id: { $in: ids } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  addToCart(product) {
    const updatedCartItems = [...this.cart.items];

    const index = updatedCartItems.findIndex(
      (cartProduct) =>
        cartProduct.productId.toString() === product._id.toString()
    );

    if (index >= 0) {
      updatedCartItems[index].quantity++;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1,
        // price: product.price,
        // title: product.title,
      });
    }

    const db = getDb();
    return db.collection('Users').updateOne(
      {
        _id: new mongodb.ObjectId(this._id),
      },
      {
        $set: { cart: { items: updatedCartItems } },
      }
    );
  }

  deleteCartItem(productId) {
    const cartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db.collection('Users').updateOne(
      {
        _id: new mongodb.ObjectId(this._id),
      },
      {
        $set: { cart: { items: cartItems } },
      }
    );
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('Users')
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((user) => user)
      .catch((err) => console.log(err));
  }

  static findByUserName(userName) {
    const db = getDb();
    return db
      .collection('Users')
      .findOne({ name: userName })
      .then((user) => {
        // console.log("found user", user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
