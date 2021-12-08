const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/authentication');

console.log('Admin routes');

router.get('/products', isAuthenticated, adminController.getProducts);

router.get(
  '/add-product',
  //   (req, res, next) => {
  //     if (!req.session.isAuthenticated) {
  //       return res.redirect('/login');
  //     }
  //     next();
  //   },
  isAuthenticated,
  adminController.getAddProduct
);

router.post('/add-product', isAuthenticated, adminController.postAddProduct);

router.get(
  '/products/:productid',
  isAuthenticated,
  adminController.getEditProduct
);

router.post('/products', isAuthenticated, adminController.postEditProduct);

router.post(
  '/delete-product',
  isAuthenticated,
  adminController.postDeleteProduct
);

router.get('/add-category', isAuthenticated, adminController.getAddCategory);

router.post('/add-category', isAuthenticated, adminController.postAddCategory);

router.get('/categories', isAuthenticated, adminController.getCategories);

router.get(
  '/categories/:categoryid',
  isAuthenticated,
  adminController.getEditCategory
);

router.post('/categories', isAuthenticated, adminController.postEditCategory);

router.post(
  '/delete-category',
  isAuthenticated,
  adminController.postDeleteCategory
);

module.exports = router;
