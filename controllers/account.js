exports.getLogin = (req, res, next) => {
  res.render('account/login', {
    pageTitle: 'Login',
    path: '/login',
  });
};

exports.postLogin = (req, res, next) => {
  res.redirect('/');
};

exports.getRegister = (req, res, next) => {
  res.render('account/register', {
    pageTitle: 'Register',
    path: '/register',
  });
};

exports.postRegister = (req, res, next) => {
  res.redirect('/login');
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
