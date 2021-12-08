const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');
const isAuthenticated = require('../middleware/authentication');
const csrf = require('../middleware/csrf');

console.log('shop routes');

router.use(csrf);

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/categories/:categoryId', shopController.getProductsByCategoryId);

router.get('/details', shopController.getProductDetails);

router.get('/cart', isAuthenticated, shopController.getCart);

router.post('/cart', isAuthenticated, shopController.postCart);

router.post(
  '/delete-cartItem',
  isAuthenticated,
  shopController.postCartDeleteItem
);

router.get('/orders', isAuthenticated, shopController.getOrders);

router.post('/create-order', isAuthenticated, shopController.postOrder);

module.exports = router;
