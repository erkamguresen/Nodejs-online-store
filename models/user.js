const getDb = require("../utilities/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(name, email, id) {
    this.name = name;
    this.email = email;
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDb();
    return db.collection("Users").insertOne(this);
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("Users")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((user) => user)
      .catch((err) => console.log(err));
  }

  static findByUserName(userName) {
    const db = getDb();
    return db
      .collection("Users")
      .findOne({ name: userName })
      .then((user) => user)
      .catch((err) => console.log(err));
  }
}

module.exports = User;
