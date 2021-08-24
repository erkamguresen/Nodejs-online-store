const connection = require("../utilities/database");

module.exports = class Product {
  constructor(name, price, imageURL, description, categoryId) {
    this.name = name;
    this.price = price;
    this.imageURL = imageURL;
    this.description = description;
    this.categoryId = categoryId;
  }

  saveProduct() {
    return connection.execute(
      "INSERT INTO products (name, price, imageURL, description) VALUES (?, ?, ?, ?)",
      [this.name, this.price, this.imageURL, this.description]
    );
  }

  static getAllProducts() {
    return connection.execute("SELECT * FROM products");
  }

  static getProductById(id) {
    return connection.execute("SELECT * FROM products WHERE id = ?", [id]);
  }

  static getProductsByCategoryId(categoryId) {}

  static updateProduct(product) {}

  static deleteProductById(productId) {}
};
