const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  const products = Product.getAll();

  res.render("shop/index", {
    title: "Shopping",
    products: products,
    path: "/",
  });
};

exports.getProducts = (req, res, next) => {
  const products = Product.getAll();

  res.render("shop/products", {
    title: "Products",
    products: products,
    path: "/products",
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  const product = Product.getProductById(productId);

  res.render("shop/product-detail", {
    title: product.name,
    product: product,
    path: "/products",
  });
};

exports.getProductDetails = (req, res, next) => {
  const products = Product.getAll();

  res.render("shop/details", {
    title: "Details",
    products: products,
    path: "/details",
  });
};

exports.getCart = (req, res, next) => {
  const products = Product.getAll();

  res.render("shop/cart", {
    title: "Cart",
    products: products,
    path: "/cart",
  });
};
exports.getOrders = (req, res, next) => {
  const products = Product.getAll();

  res.render("shop/orders", {
    title: "Orders",
    products: products,
    path: "/orders",
  });
};
