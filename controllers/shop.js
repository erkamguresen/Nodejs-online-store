const Product = require("../models/product");
const Category = require("../models/category");

exports.getIndex = (req, res, next) => {
  const categories = Category.getAllCategories();

  Product.getAllProducts()
    .then((products) => {
      res.render("shop/index", {
        title: "Shopping",
        products: products[0],
        categories: categories,
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  const categories = Category.getAllCategories();

  Product.getAllProducts()
    .then((products) => {
      res.render("shop/products", {
        title: "Products",
        products: products[0],
        categories: categories,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductsByCategoryId = (req, res, next) => {
  const categoryId = req.params.categoryId;
  const products = Product.getProductsByCategoryId(categoryId);
  const categories = Category.getAllCategories();

  res.render("shop/products", {
    title: "Products",
    products: products,
    categories: categories,
    selectedCategory: categoryId,
    path: "/products",
  });
};

exports.getProduct = (req, res, next) => {
  Product.getProductById(req.params.productId)
    .then((product) => {
      res.render("shop/product-detail", {
        title: product[0][0].name,
        product: product[0][0],
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDetails = (req, res, next) => {
  const products = Product.getAllProducts();

  res.render("shop/details", {
    title: "Details",
    products: products,
    path: "/details",
  });
};

exports.getCart = (req, res, next) => {
  const products = Product.getAllProducts();

  res.render("shop/cart", {
    title: "Cart",
    products: products,
    path: "/cart",
  });
};
exports.getOrders = (req, res, next) => {
  const products = Product.getAllProducts();

  res.render("shop/orders", {
    title: "Orders",
    products: products,
    path: "/orders",
  });
};
