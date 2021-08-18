const express = require("express");
const router = express.Router();

const path = require("path");

router.get("/", (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../views/index.html"));

  const products = [
    {
      name: "IPhone 7",
      price: 700,
      image: "1.jpg",
      description: "goed phone",
    },
    {
      name: "IPhone 8S",
      price: 800,
      image: "2.jpg",
      description: "goed phone",
    },
    {
      name: "Samsung S8",
      price: 300,
      image: "3.jpg",
      description: "goed phone",
    },
    {
      name: "Samsung S7",
      price: 250,
      image: "4.jpg",
      description: "goed phone",
    },
  ];

  res.render("index", { title: "Homepage" });
});

module.exports = router;
