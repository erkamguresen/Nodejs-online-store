const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      Category.findAll().then((categories) => {
        res.render('shop/index', {
          title: 'Shopping',
          products: products,
          categories: categories,
          path: '/',
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      Category.findAll().then((categories) => {
        res.render('shop/products', {
          title: 'Products',
          products: products,
          path: '/',
          categories: categories,
        });
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
      return Product.findByCategoryId(categoryId);
    })
    .then((products) => {
      res.render('shop/products', {
        title: 'Products',
        products: products,
        categories: model.categories,
        selectedCategory: parseInt(categoryId),
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  // Product.findByPk(req.params.productId)
  Product.findById(req.params.productId)
    .then((product) => {
      res.render('shop/product-detail', {
        title: product.name,
        product: product,
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDetails = (req, res, next) => {
  const products = Product.getAllProducts();

  res.render('shop/details', {
    title: 'Details',
    products: products,
    path: '/details',
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render('shop/cart', {
        title: 'Cart',
        products: products,
        path: '/cart',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = parseInt(req.body.productId);
  console.log('product Id', productId);

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
      return res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ['products'] });

    res.render('shop/orders', {
      title: 'Orders',
      path: '/orders',
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
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
          res.redirect('/orders');
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
