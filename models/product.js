const connection = require("../utilities/database");

module.exports = class Product {
  constructor(name, price, imageURL, description, categoryId) {
    this.name = name;
    this.price = price;
    this.imageURL = imageURL;
    this.description = description;
    this.categoryId = categoryId;
  }

  saveProduct() {}

  static getAllProducts() {
    return connection.execute("SELECT * FROM products");
  }

  static getProductById(id) {}

  static getProductsByCategoryId(categoryId) {}

  static updateProduct(product) {}

  static deleteProductById(productId) {}
};
