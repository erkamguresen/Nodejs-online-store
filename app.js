const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const User = require('./models/user');

app.set('view engine', 'pug');
app.set('views', './views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

const errorController = require('./controllers/errors');

const port = process.env.PORT || 3000;
const static = process.env.STATIC_DIR || 'public';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, static)));

app.use((req, res, next) => {
  User.findOne({ name: 'admin' }).then((user) => {
    if (user) {
      req.user = user;
      console.log(req.user);
      next();
    }
  });
});

app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404Page);

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to mongoDB');

    User.findOne({ name: 'admin' })
      .then((user) => {
        if (!user) {
          user = new User({
            name: 'admin',
            email: 'admin@vmail.com',
            cart: { items: [] },
          });
          return user.save();
        } else {
          return user;
        }
      })
      .then((user) => {
        console.log('user name', user);
        app.listen(port);
      });
  })
  .catch((err) => {
    console.log(err);
  });
