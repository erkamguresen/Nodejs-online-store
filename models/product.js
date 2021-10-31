const getDb = require("../utilities/database").getDb;
const ObjectId = require("mongodb").ObjectId;

class Product {
  constructor(name, price, description, imageURL) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
  }

  save() {
    console.log(this);

    const db = getDb();

    db.collection("products")
      .insertOne(this)
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
    return db
      .collection("products")
      .find({ _id: new ObjectId(productId) })
      .toArray()
      .then((product) => {
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
