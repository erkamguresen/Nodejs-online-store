const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res, next) => {
  res.render('account/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isAuthenticated,
    // csrfToken: req.csrfToken(), // csrf token added by middelware
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }
      bcrypt
        .compare(email + password + process.env.SALT_SECRET, user.password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.user = user;
            req.session.isAuthenticated = true;
            return req.session.save((err) => {
              console.log(err);
              var url = req.session.redirectTo || '/';
              delete req.session.redirectTo;
              res.redirect(url);
            });
          }
          return res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getRegister = (req, res, next) => {
  res.render('account/register', {
    pageTitle: 'Register',
    path: '/register',
    isAuthenticated: req.session.isAuthenticated,
    error: req.query.error,
  });
};

exports.postRegister = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (emailRegexp.test(email) === false) {
    return res.redirect('/register?error=email-format');
  }

  const passwordRegexp = new RegExp(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'
  );
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

  if (passwordRegexp.test(password) === false) {
    return res.redirect('/register?error=weak-password');
  }

  if (password !== confirmPassword) {
    return res.redirect('/register?error=password-mismatch');
  } else {
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          return res.redirect('/register?error=email-exists');
        }

        return bcrypt.hash(email + password + process.env.SALT_SECRET, 12);
      })
      .then((hashedPassword) => {
        console.log('hashedPassword', hashedPassword);

        const newUser = new User({
          name: name,
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });

        return newUser.save().then((result) => {
          console.log('User created');
          res.redirect('/login');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getResetPassword = (req, res, next) => {
  res.render('account/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
  });
};

exports.postResetPassword = (req, res, next) => {
  res.redirect('/login');
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
  });

  res.redirect('/');
};
