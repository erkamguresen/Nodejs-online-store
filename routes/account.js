const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account');

console.log('Account routes');

router.get('/login', accountController.getLogin);
router.post('/login', accountController.postLogin);

router.get('/register', accountController.getRegister);
router.post('/register', accountController.postRegister);

router.get('/reset-password', accountController.getResetPassword);
router.post('/reset-password', accountController.postResetPassword);

router.get('/logout', accountController.getLogout);

module.exports = router;