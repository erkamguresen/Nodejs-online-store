const Product = require('../models/product');
const Category = require('../models/category');

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .find({ name : 'Iphone 6', price: 200})
    // .limit(10)
    // .sort({ price: -1 })
    // .select({ name: 1, price: 1, _id: 0 })
    // join the other table and exclude the id
    // .populate('userId', 'name -_id cart')
    .select('name price userId imageURL categories')
    .then((products) => {
      res.render('admin/products', {
        title: 'Admin Products',
        products: products,
        path: '/admin/products',
        action: req.query.action,
        // isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  // if(!req.session.isAuthenticated){
  //   return res.redirect('/login');
  // }

  res.render('admin/add-product', {
    title: 'New Product',
    path: '/admin/add-product',
    isAuthenticated: req.session.isAuthenticated,
    // csrfToken: req.csrfToken(), // csrf token added by middelware
  });
};

exports.postAddProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  // const imageURL = req.body.imageURL;
  const file = req.file;
  const description = req.body.description;

  console.log('image file', file);

  const product = new Product({
    name: name,
    price: price,
    description: description,
    imageURL: file.filename,
    // imageURL: imageURL,
    userId: req.user, //mongoose add only the id of the user
    isActive: true,
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
  Product.findOne({ _id: req.params.productid, userId: req.user._id })
    .then((product) => {
      if (!product) {
        return res.redirect('/admin/products');
      }
      return product;
    })
    .then((product) => {
      Category.find().then((categories) => {
        categories = categories.map((category) => {
          if (product.categories) {
            product.categories.forEach((item) => {
              if (item.toString() === category._id.toString()) {
                category.selected = true;
              }
            });
          }
          return category;
        });

        res.render('admin/edit-product', {
          title: 'Edit Product',
          product: product,
          path: '/admin/products',
          categories: categories,
          isAuthenticated: req.session.isAuthenticated,
        });
      });
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
  // isAuthenticated: req.session.isAuthenticated,
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
  const categories = req.body.categoryIds || [];

  // update first method
  Product.updateOne(
    { _id: id, userId: req.user._id },
    {
      $set: {
        name: name,
        price: price,
        description: description,
        imageURL: imageURL,
        categories: categories,
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

  Product.deleteOne({ _id: id, userId: req.user._id })
    // Product.findByIdAndRemove(id)
    .then(() => {
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
    isAuthenticated: req.session.isAuthenticated,
    // csrfToken: req.csrfToken(), // csrf token added by middelware
  });
};

exports.postAddCategory = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;

  const category = new Category({ name, description });

  category
    .save()
    .then((result) => {
      res.redirect('/admin/categories?action=add');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCategories = (req, res, next) => {
  Category.find()
    .then((categories) => {
      res.render('admin/categories', {
        title: 'Categories',
        path: '/admin/categories',
        categories: categories,
        action: req.query.action,
        isAuthenticated: req.session.isAuthenticated,
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
        isAuthenticated: req.session.isAuthenticated,
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

  Category.updateOne(
    { _id: id },
    {
      $set: {
        name: name,
        description: description,
      },
    }
  )
    .then((result) => {
      res.redirect('/admin/categories?action=edit');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteCategory = (req, res, next) => {
  const id = req.body.categoryId;

  Category.findByIdAndRemove(id)
    .then(() => {
      res.redirect('/admin/categories?action=delete');
    })
    .catch((err) => {
      console.log(err);
    });
};
