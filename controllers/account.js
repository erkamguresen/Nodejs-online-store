const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('account/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === 'email@gmail.com' && password === 'password') {
    req.session.isAuthenticated = true;
    res.redirect('/');
  } else {
    req.session.isAuthenticated = false;
    res.redirect('/login');
  }
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
  console.log('postRegister', req.body);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  console.log(req.body);
  if (password !== confirmPassword) {
    console.log('redirect here');
    return res.redirect('/register?error=password');
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log('or redirect here');
        return res.redirect('/register');
      }

      const newUser = new User({
        name: name,
        email: email,
        password: password,
        cart: { items: [] },
      });

      return newUser
        .save()
        .then((result) => {
          console.log('User created');
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
        });
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
  // TODO: Logout
  res.redirect('/login');
};
