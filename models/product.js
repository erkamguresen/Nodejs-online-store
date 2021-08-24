const products = [
  {
    id: "93984",
    name: "IPhone 7",
    price: 700,
    imageURL: "1.jpg",
    description: "goed phone",
    categoryId: "1",
  },
  {
    id: "66869",
    name: "IPhone 8S",
    price: 800,
    imageURL: "2.jpg",
    description: "very goed phone",
    categoryId: "1",
  },
  {
    id: "66885",
    name: "Samsung S8",
    price: 300,
    imageURL: "3.jpg",
    description: "it is a ok phone",
    categoryId: "1",
  },
  {
    id: "21193",
    name: "Samsung S7",
    price: 250,
    imageURL: "4.jpg",
    description: "just a phone nothing more complicated",
    categoryId: "1",
  },
  {
    id: "76885",
    name: "Laptop",
    price: 300,
    imageURL: "3.jpg",
    description: "it is a ok laptop",
    categoryId: "2",
  },
  {
    id: "51193",
    name: "Fridge",
    price: 250,
    imageURL: "4.jpg",
    description: "just a computer nothing more complicated",
    categoryId: "3",
  },
];

module.exports = class Product {
  constructor(name, price, imageURL, description, categoryId) {
    this.id = (Math.floor(Math.random() * 99999) + 1).toString();
    this.name = name;
    this.price = price;
    this.imageURL = imageURL;
    this.description = description;
    this.categoryId = categoryId;
  }

  saveProduct() {
    products.push(this);
  }

  static getAll() {
    return products;
  }

  static getProductById(id) {
    const product = products.find((product) => product.id === id);
    return product;
  }

  static getProductsByCategoryId(categoryId) {
    const product = products.filter(
      (product) => product.categoryId === categoryId
    );
    return product;
  }

  static updateProduct(product) {
    const index = products.findIndex((data) => data.id === product.id);

    products[index] = product;
  }

  static deleteProductById(productId) {
    const index = products.findIndex((data) => data.id === productId);
    products.splice(index, 1);
  }
};
