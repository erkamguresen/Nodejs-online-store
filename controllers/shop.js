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
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          return res.render("shop/cart", {
            title: "Cart",
            products: products,
            path: "/cart",
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

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let quantity = 1;
  let userCart;

  req.user
    .getCart()
    .then((cart) => {
      userCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      if (products.length > 0) {
        quantity = products[0].cartItem.quantity + 1;
      }

      return Product.findByPk(productId);
    })
    .then((product) => {
      return userCart.addProduct(product, {
        through: {
          quantity: quantity,
        },
      });
    })
    .then((cart) => {
      return res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = parseInt(req.body.productId);
  console.log("product Id", productId);

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];

      return product.cartItem.destroy();
    })
    .then(() => {
      return res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
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

exports.postOrder = (req, res, next) => {
  let userCart;
  req.user
    .getCart()
    .then((cart) => {
      userCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            products.map((product) => {
              product.orderItem = {
                quantity: product.cartItem.quantity,
                price: product.price,
              };
              return product;
            })
          );
        })
        .then(() => {
          userCart.setProducts(null);
        })
        .then(() => {
          res.redirect("/orders");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

  const products = Product.getAllProducts();

  res.render("shop/orders", {
    title: "Orders",
    products: products,
    path: "/orders",
  });
};
