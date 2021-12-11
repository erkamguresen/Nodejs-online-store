const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account');
const csrf = require('../middleware/csrf');

console.log('Account routes');

router.use(csrf);

router.get('/login', accountController.getLogin);
router.post('/login', accountController.postLogin);

router.get('/register', accountController.getRegister);
router.post('/register', accountController.postRegister);

router.get('/reset-password', accountController.getResetPassword);
router.post('/reset-password', accountController.postResetPassword);

router.get('/new-password/:token', accountController.getNewPassword);
router.post('/new-password', accountController.postNewPassword);

router.get('/logout', accountController.getLogout);

module.exports = router;
