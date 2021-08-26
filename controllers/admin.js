const Product = require("../models/product");
const Category = require("../models/category");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        title: "Admin Products",
        products: products,
        path: "/admin/products",
        action: req.query.action,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  Category.findAll().then((categories) => {
    res.render("admin/add-product", {
      title: "New Product",
      path: "/admin/add-product",
      categories: categories,
    });
  });

  // res.render("admin/add-product", {
  //   title: "New Product",
  //   path: "/admin/add-product",
  //   // categories: categories[0],
  // });

  // Category.getAllCategories()
  //   .then((categories) => {
  //     res.render("admin/add-product", {
  //       title: "New Product",
  //       path: "/admin/add-product",
  //       categories: categories[0],
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.postAddProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const imageURL = req.body.imageURL;
  const description = req.body.description;
  const categoryId = req.body.categoryId;

  Product.create({
    name: name,
    price: price,
    imageURL: imageURL,
    description: description,
    categoryId: categoryId,
  })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  Product.findByPk(req.params.productId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      Category.findAll().then((categories) => {
        res.render("admin/edit-product", {
          title: "Edit Product",
          path: "/admin/products",
          product: product,
          categories: categories,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const imageURL = req.body.imageURL;
  const description = req.body.description;
  const categoryId = req.body.categoryId;

  Product.findByPk(req.body.id)
    .then((product) => {
      product.id = id;
      product.name = name;
      product.price = price;
      product.imageURL = imageURL;
      product.description = description;
      product.categoryId = categoryId;
      return product.save();
    })
    .then(() => {
      console.log("updated");
      res.redirect("/admin/products?action=edit");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;

  Product.findByPk(id)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      console.log("product has been deleted");
      res.redirect("/admin/products?action=delete");
    })
    .catch((err) => {
      console.log(err);
    });
};
