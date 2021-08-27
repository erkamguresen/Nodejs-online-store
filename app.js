const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");

const path = require("path");
const errorController = require("./controllers/errors");

const sequelize = require("./utilities/database");

const Category = require("./models/category");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");

Product.belongsTo(Category, {
  foreignKey: {
    allowNull: false,
  },
});

Category.hasMany(Product);

Product.belongsTo(User);
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  .sync({ force: true })
  // .sync()
  .then(() => {
    User.findByPk(1)
      .then((user) => {
        if (!user) {
          User.create({
            name: "John",
            email: "john@example.com",
          });
        }
        return user;
      })
      .then((user) => {
        Category.count().then((count) => {
          if (count === 0) {
            Category.bulkCreate([
              { name: "Phone", description: "Phone description" },
              { name: "Tablet", description: "Tablet description" },
              { name: "Laptop", description: "Laptop description" },
              { name: "Electronics", description: "Electronics description" },
            ]);
          }
        });
      });
  })
  .then(() => {
    Product.count().then((count) => {
      /*
      if (count === 0) {
        Product.bulkCreate([
          {
            name: "iPhone X",
            price: "1299",
            imageURL: "1.jpg",
            description: "iPhone X description",
            categoryId: 1,
          },
          {
            name: "iPhone XS",
            price: "1099",
            imageURL: "2.jpg",
            description: "iPhone XS description",
            categoryId: 1,
          },
          {
            name: "Samsung S7",
            price: "899",
            imageURL: "3.jpg",
            description: "Samsung S7 description",
            categoryId: 1,
          },
          {
            name: "Samsung S8",
            price: "999",
            imageURL: "4.jpg",
            description: "Samsung S8 description",
            categoryId: 1,
          },
          {
            name: "Samsung Tablet",
            price: "697",
            imageURL: "3.jpg",
            description: "Samsung Tablet description",
            categoryId: 2,
          },
          {
            name: "Samsung Laptop",
            price: "999",
            imageURL: "4.jpg",
            description: "Samsung Laptop description",
            categoryId: 3,
          },
          {
            name: "Samsung Smartwatch",
            price: "659",
            imageURL: "3.jpg",
            description: "Samsung Smartwatch description",
            categoryId: 3,
          },
        ]);
        
      }*/
    });
  })
  .catch((error) => console.log(error));

app.set("view engine", "pug");
app.set("views", "./views");

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
      next();
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes.routes);

app.use(userRoutes);

app.use(errorController.get404Page);

app.listen(3000, () => {
  console.log("listening on port 3000:\nhttp://localhost:3000/");
});
