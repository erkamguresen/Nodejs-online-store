const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      Category.find().then((categories) => {
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
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  Product.find()
    // .find({ price: { $gte: 10, $lte: 20 } })
    // .find({ price: { $eq: 10} })
    // .find({ price: { $in: [100, 200, 300]} })
    // .find({ price: { $gt: 300}, name: { $regex: /^p/i } })
    // .find({ price: { $gt: 300}, name: "Samsung S6"} })
    // .find( {$or: [{ price: { $gt: 300}}, {name: "Samsung S6"}]})
    //starts with
    // .find({name: /^Samsung/})
    //ends with
    // .find({name: /Samsung$/})
    //contains
    // .find({name: /.*Samsung.*/})

    .then((products) => {
      Category.find().then((categories) => {
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
  const model = {};

  Category.find()
    .then((categories) => {
      model.categories = categories;
      return Product.find({ categories: categoryId });
    })
    .then((products) => {
      console.log(model.categories);
      console.log(categoryId);
      res.render('shop/products', {
        title: 'Products',
        products: products,
        categories: model.categories,
        selectedCategory: categoryId,
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  Product
    // .findById(req.params.productId)
    .findOne({ _id: req.params.productId })
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
  const productId = req.body.productId;

  req.user
    .deleteCartItem(productId)
    .then(() => {
      return res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();

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
  req.user
    .addOrder()
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};
