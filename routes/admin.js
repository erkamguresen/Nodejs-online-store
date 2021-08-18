const express = require("express");
const router = express.Router();

const path = require("path");

router.get("/addproduct", (req, res, next) => {
  //   res.sendFile(path.join(__dirname, "../views/add-product.html"));
  res.render("add-product", { title: "Add Product" });
});

router.post("/addproduct", (req, res, next) => {
  console.log(req.body);

  res.redirect("/");
});

module.exports = router;
