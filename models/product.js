const getDb = require("../utilities/database").getDb;
const ObjectId = require("mongodb").ObjectId;
const mongodb = require("mongodb");

class Product {
  constructor(name, price, description, imageURL, id, userId) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    let db = getDb();

    if (this._id) {
      db = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      db = db.collection("products").insertOne(this);
    }

    return db
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .project({ description: 0 })
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(productId) {
    const db = getDb();
    return (
      db
        .collection("products")
        .findOne({ _id: new ObjectId(productId) })
        // .toArray()
        .then((product) => {
          return product;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
