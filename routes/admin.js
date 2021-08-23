const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get("/products/:productId", adminController.getEditProduct);

router.get("/products", adminController.getProducts);

router.post("/products", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

exports.routes = router;
