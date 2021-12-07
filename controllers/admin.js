const Product = require('../models/product');
const Category = require('../models/category');

exports.getProducts = (req, res, next) => {
  Product.find()
    // .find({ name : 'Iphone 6', price: 200})
    // .limit(10)
    // .sort({ price: -1 })
    // .select({ name: 1, price: 1, _id: 0 })
    .then((products) => {
      res.render('admin/products', {
        title: 'Admin Products',
        products: products,
        path: '/admin/products',
        action: req.query.action,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    title: 'New Product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const imageURL = req.body.imageURL;
  const description = req.body.description;

  const product = new Product({
    name: name,
    price: price,
    description: description,
    imageURL: imageURL,
    userId: req.user, //mongoose add only the id of the user
  });

  product
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  Product.findById(req.params.productid)
    .then((product) => {
      // Category.findAll().then((categories) => {
      //   categories = categories.map((category) => {
      //     if (product.categories) {
      //       product.categories.forEach((item) => {
      //         if (item == category._id) {
      //           category.selected = true;
      //         }
      //       });
      //     }
      //     return category;
      //   });

      res.render('admin/edit-product', {
        title: 'Edit Product',
        product: product,
        path: '/admin/products',
        // categories: categories,
      });
      // });
    })
    .catch((err) => {
      console.log(err);
    });

  // Product.findByPk(req.params.productid)
  //   .then((product) => {
  //     if (!product) {
  //       return res.redirect("/");
  //     }
  //     Category.findAll()
  //       .then((categories) => {
  //         res.render("admin/edit-product", {
  //           title: "Edit Product",
  //           path: "/admin/products",
  //           product: product,
  //           categories: categories,
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const imageURL = req.body.imageURL;
  const description = req.body.description;
  // const categories = req.body.categoryIds;

  // update first method
  Product.updateOne(
    { _id: id },
    {
      $set: {
        name: name,
        price: price,
        description: description,
        imageURL: imageURL,
      },
    }
  )
    .then((result) => {
      res.redirect('/admin/products?action=edit');
    })
    .catch((err) => {
      console.log(err);
    });

  // query first method
  /*
  Product.findById(id)
    .then((product) => {
      product.name = name;
      product.price = price;
      product.description = description;
      product.imageURL = imageURL;
      // product.categories = categories;

      return product.save();
    })
    .then((result) => {
      res.redirect('/admin/products?action=edit');
    }).catch((err) => {
      console.log(err);
    });
    */
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;

  // Product.deleteOne({ _id: id })
  Product.findByIdAndRemove(id)
    .then(() => {
      console.log('product has been deleted.');
      res.redirect('/admin/products?action=delete');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddCategory = (req, res, next) => {
  res.render('admin/add-category', {
    title: 'New Category',
    path: '/admin/add-category',
  });
};

exports.postAddCategory = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;

  const category = new Category(name, description);

  category
    .save()
    .then((result) => {
      console.log(result);
      res.redirect('/admin/categories?action=add');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCategories = (req, res, next) => {
  Category.findAll()
    .then((categories) => {
      res.render('admin/categories', {
        title: 'Categories',
        path: '/admin/categories',
        categories: categories,
        action: req.query.action,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditCategory = (req, res, next) => {
  Category.findById(req.params.categoryid)
    .then((category) => {
      res.render('admin/edit-category', {
        title: 'Edit Category',
        category: category,
        path: '/admin/categories',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditCategory = (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;

  const category = new Category(name, description, id);

  category
    .save()
    .then((result) => {
      res.redirect('/admin/categories?action=edit');
    })
    .catch((err) => {
      console.log(err);
    });
};
