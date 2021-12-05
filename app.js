const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");

const User = require("./models/user");

app.set("view engine", "pug");
app.set("views", "./views");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");

const errorController = require("./controllers/errors");
const mongoConnect = require("./utilities/database").mongoConnect;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByUserName("admin").then((user) => {
    if (user) {
      req.user = new User(user.username, user.email, user._id);
      next();
    }
  });
});

app.use("/admin", adminRoutes);
app.use(userRoutes);

app.use(errorController.get404Page);

mongoConnect(() => {
  User.findByUserName("admin")
    .then((user) => {
      if (!user) {
        user = new User("admin", "admin@vmail.com");
        return user.save();
      } else {
        return user;
      }
    })
    .then((user) => {
      console.log("user name", user);
      app.listen(3000);
    })
    .catch((err) => {
      console.log(err);
    });
});
