const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/authentication');
const csrf = require('../middleware/csrf');
const isAdmin = require('../middleware/isAdmin');

console.log('Admin routes');

router.use(csrf);
router.use(isAuthenticated);
router.use(isAdmin);

router.get('/products', adminController.getProducts);

router.get(
  '/add-product',
  //   (req, res, next) => {
  //     if (!req.session.isAuthenticated) {
  //       return res.redirect('/login');
  //     }
  //     next();
  //   },
  adminController.getAddProduct
);

router.post('/add-product', adminController.postAddProduct);

router.get('/products/:productid', adminController.getEditProduct);

router.post('/products', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

router.get('/add-category', adminController.getAddCategory);

router.post('/add-category', adminController.postAddCategory);

router.get('/categories', adminController.getCategories);

router.get('/categories/:categoryid', adminController.getEditCategory);

router.post('/categories', adminController.postEditCategory);

router.post('/delete-category', adminController.postDeleteCategory);

module.exports = router;
