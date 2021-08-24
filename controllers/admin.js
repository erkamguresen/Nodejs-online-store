const Product = require("../models/product");
const Category = require("../models/category");

exports.getProducts = (req, res, next) => {
  Product.getAllProducts()
    .then((products) => {
      res.render("admin/products", {
        title: "Admin Products",
        products: products[0],
        path: "/admin/products",
        action: req.query.action,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  const categories = Category.getAllCategories();

  res.render("admin/add-product", {
    title: "New Product",
    path: "/admin/add-product",
    categories: categories,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.name,
    req.body.price,
    req.body.imageURL,
    req.body.description,
    req.body.categoryId
  );

  product
    .saveProduct()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const categories = Category.getAllCategories();

  Product.getAllProducts()
    .then((products) => {
      res.render("admin/edit-product", {
        title: "Edit Product",
        path: "/admin/products",
        product: products[0][0],
        categories: categories,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const product = Product.getProductById(req.body.id);

  product.name = req.body.name;
  product.price = req.body.price;
  product.imageURL = req.body.imageURL;
  product.description = req.body.description;
  product.categoryId = req.body.categoryId;

  Product.updateProduct(product);
  res.redirect("/admin/products?action=edit");
};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteProductById(req.body.productId);
  res.redirect("/admin/products?action=delete");
};
