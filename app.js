const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

var store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'mySessions',
});

app.set('view engine', 'pug');
app.set('views', './views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const accountRoutes = require('./routes/account');

const errorController = require('./controllers/errors');

const port = process.env.PORT || 3000;
const static = process.env.STATIC_DIR || 'public';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: store,
  })
);
app.use(express.static(path.join(__dirname, static)));

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);

app.use(errorController.get404Page);

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to mongoDB');

    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
