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
      "INSERT INTO products (name, price, imageURL, description, categoryId) VALUES (?, ?, ?, ?,?)",
      [this.name, this.price, this.imageURL, this.description, this.categoryId]
    );
  }

  static getAllProducts() {
    return connection.execute("SELECT * FROM products");
  }

  static getProductById(id) {
    return connection.execute("SELECT * FROM products WHERE id = ?", [id]);
  }

  static getProductsByCategoryId(categoryId) {
    return connection.execute(`SELECT * FROM products WHERE categoryId = ?`, [
      categoryId,
    ]);
  }

  static updateProduct(product) {
    return connection.execute(
      `UPDATE products SET products.name = ?, 
    products.price = ?, products.imageURL = ?, 
    products.description = ?, products.categoryId = ? WHERE products.id = ?`,
      [
        product.name,
        product.price,
        product.imageURL,
        product.description,
        product.categoryId,
        product.id,
      ]
    );
  }

  static deleteProductById(productId) {
    return connection.execute("DELETE FROM products WHERE id = ?", [productId]);
  }
};
