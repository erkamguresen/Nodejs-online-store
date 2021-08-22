const express = require("express");
const router = express.Router();

// const path = require("path");
const productsController = require("../controllers/products");

router.get("/addproduct", productsController.getAddProduct);

router.post("/addproduct", productsController.postAddProduct);

exports.routes = router;
