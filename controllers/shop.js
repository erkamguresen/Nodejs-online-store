const Product = require("../models/product");
const Category = require("../models/category");

exports.getIndex = (req, res, next) => {
  Product.findAll({
    attributes: ["id", "name", "price", "imageURL", "description"],
  })
    .then((products) => {
      Category.findAll()
        .then((categories) => {
          res.render("shop/index", {
            title: "Shopping",
            products: products,
            categories: categories,
            path: "/",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll({
    attributes: ["id", "name", "price", "imageURL", "description"],
  })
    .then((products) => {
      Category.findAll()
        .then((categories) => {
          res.render("shop/products", {
            title: "Products",
            products: products,
            categories: categories,
            path: "/products",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductsByCategoryId = (req, res, next) => {
  const categoryId = req.params.categoryId;
  const model = [];

  Category.findAll()
    .then((categories) => {
      model.categories = categories;
      const category = categories.find((i) => i.id == categoryId);
      return category.getProducts();
    })
    .then((products) => {
      res.render("shop/products", {
        title: "Products",
        products: products,
        categories: model.categories,
        selectedCategory: parseInt(categoryId),
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  // Product.findByPk(req.params.productId)
  Product.findAll({
    attributes: ["id", "name", "price", "imageURL", "description"],
    where: { id: req.params.productId },
  })
    .then((products) => {
      // .then((product) => {
      res.render("shop/product-detail", {
        title: products[0].name,
        product: products[0],
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
