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

  addOrder() {
    const db = getDb();

    return this.getCart()
      .then((products) => {
        const order = {
          items: products.map((product) => {
            return {
              productId: product._id,
              name: product.name,
              price: product.price,
              imageURL: product.imageURL,
              userId: product._id,
              quantity: product.quantity,
            };
          }),
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name,
            email: this.email,
          },
          date: new Date().toLocaleString(),
        };

        return db.collection('orders').insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };
        return db.collection('Users').updateOne(
          {
            _id: new mongodb.ObjectId(this._id),
          },
          {
            $set: { cart: { items: [] } },
          }
        );
      });
  }

  getOrders() {}

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
