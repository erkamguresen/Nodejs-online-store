const User = require('../models/user');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;

  res.render('account/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isAuthenticated,
    // csrfToken: req.csrfToken(), // csrf token added by middelware
    errorMessage: errorMessage,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.session.errorMessage = 'User not found';
        req.session.save((err) => {
          if (err) console.log(err);

          return res.redirect('/login');
        });
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
          } else {
            req.session.errorMessage = 'Wrong password';
            return res.redirect('/login');
          }
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
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;

  res.render('account/register', {
    pageTitle: 'Register',
    path: '/register',
    isAuthenticated: req.session.isAuthenticated,
    error: req.query.error,
    errorMessage: errorMessage,
  });
};

exports.postRegister = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const passwordRegexp = new RegExp(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'
  );
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

  if (emailRegexp.test(email) === false) {
    req.session.errorMessage = 'Invalid email';
    req.session.save((err) => {
      if (err) console.log(err);

      return res.redirect('/register');
    });
  } else if (passwordRegexp.test(password) === false) {
    req.session.errorMessage =
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one number ';
    req.session.save((err) => {
      if (err) console.log(err);

      return res.redirect('/register');
    });
  } else if (password !== confirmPassword) {
    req.session.errorMessage = 'Passwords do not match';
    req.session.save((err) => {
      if (err) console.log(err);

      return res.redirect('/register');
    });
  } else {
    try {
      const user = await User.findOne({ email: email });

      console.log('user in db', user);
      if (user) {
        req.session.errorMessage = 'This user already exists.';
        req.session.save((err) => {
          console.log(err);
          return res.redirect('/register');
        });
      } else {
        const hashedPassword = await bcrypt.hash(
          email + password + process.env.SALT_SECRET,
          12
        );

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

          // send a confirmation email
          const msg = {
            to: email,
            from: 'erkamguresen@gmail.com', // Change to your verified sender
            subject: 'Account created',
            // text: 'and easy to do anywhere, even with Node.js',
            html: '<h1>Wellcome to my demo project. Your account is successfully created.</h1>',
          };
          sgMail
            .send(msg)
            .then(() => {
              console.log('Email sent');
            })
            .catch((error) => {
              console.error(error);
              console.error(error.response.body);
            });
        });
      }
    } catch {
      (err) => {
        console.log(err);
      };
    }
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
