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
    description: "very goed phone",
  },
  {
    name: "Samsung S8",
    price: 300,
    image: "3.jpg",
    description: "it is a ok phone",
  },
  {
    name: "Samsung S7",
    price: 250,
    image: "4.jpg",
    description: "just a phone nothing more complicated",
  },
];

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../views/index.html"));

  res.render("index", {
    title: "Homepage",
    products: products,
    path: "/",
  });
};

exports.getAddProduct = (req, res, next) => {
  //   res.sendFile(path.join(__dirname, "../views/add-product.html"));
  res.render("add-product", {
    title: "Add Product",
    path: "/admin/addproduct",
  });
};

exports.postAddProduct = (req, res, next) => {
  // console.log(req.body);
  products.push({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    description: req.body.description,
  });
  res.redirect("/");
};
