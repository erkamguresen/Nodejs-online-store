const products = [
  {
    name: "IPhone 7",
    price: 700,
    imageURL: "1.jpg",
    description: "goed phone",
  },
  {
    name: "IPhone 8S",
    price: 800,
    imageURL: "2.jpg",
    description: "very goed phone",
  },
  {
    name: "Samsung S8",
    price: 300,
    imageURL: "3.jpg",
    description: "it is a ok phone",
  },
  {
    name: "Samsung S7",
    price: 250,
    imageURL: "4.jpg",
    description: "just a phone nothing more complicated",
  },
];

module.exports = class Product {
  constructor(name, price, imageURL, description) {
    this.name = name;
    this.price = price;
    this.imageURL = imageURL;
    this.description = description;
  }

  saveProduct() {
    products.push(this);
  }

  static getAll() {
    return products;
  }
};
