module.exports = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    req.session.redirectTo = req.url;
    return res.redirect('/login');
  }

  if (!req.session.isAdmin) {
    return res.redirect('/');
  }

  next();
};
