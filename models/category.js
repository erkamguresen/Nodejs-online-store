const getDb = require("../utilities/database").getDb;
const ObjectId = require("mongodb").ObjectId;
const mongodb = require("mongodb");

class Category {
  constructor(name, description, id) {
    this.name = name;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    let db = getDb();

    if (this._id) {
      db = db
        .collection("categories")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      db = db.collection("categories").insertOne(this);
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
      .collection("categories")
      .find()
      .toArray()
      .then((categories) => {
        return categories;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("categories")
      .findOne({ _id: new ObjectId(id) })
      .then((category) => {
        return category;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = Category;

// const connection = require("../utilities/database");

// module.exports = class Category {
//   constructor(name, description) {
//     this.id = (categories[categories.length - 1].id + 1).toString();
//     this.name = name;
//     this.description = description;
//   }

//   saveCategory() {
//     return connection.execute(
//       "INSERT INTO categories ( name, description) VALUES (?, ?)",
//       [this.name, this.description]
//     );
//   }

//   static getAllCategories() {
//     return connection.execute("SELECT * FROM categories");
//   }

//   static getCategoryById(id) {
//     return connection.execute("SELECT * FROM categories WHERE id = ?", [id]);
//   }

//   static updateCategory(category) {
//     return connection.execute(
//       "UPDATE categories SET categories.name = ?, categories.description = ? WHERE id = ?",
//       [category.name, category.description, category.id]
//     );
//   }

//   static deleteCategory(id) {
//     return connection.execute("DELETE FROM categories WHERE id = ?", [id]);
//   }
// };
