const Sequelize = require("sequelize");
const sequelize = require("../utilities/database");

const Category = sequelize.define("category", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: Sequelize.STRING,
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

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
