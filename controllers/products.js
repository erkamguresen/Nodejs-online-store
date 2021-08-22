const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../views/index.html"));

  const products = Product.getAll();

  res.render("index", {
    title: "Homepage",
    products: products,
    path: "/",
  });
};

exports.getAddProduct = (req, res, next) => {
  //   res.sendFile(path.join(__dirname, "../views/add-product.html"));
  res.render("add-product", {
    title: "Add Product",
    path: "/admin/addproduct",
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.name,
    req.body.price,
    req.body.imageURL,
    req.body.description
  );

  product.saveProduct();

  res.redirect("/");
};
