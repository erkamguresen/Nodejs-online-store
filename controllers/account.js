const User = require('../models/user');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const passwordRegexp = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');
// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

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
  if (req.body.email && req.body.password) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.session.errorMessage = 'User not found';
          req.session.save((err) => {
            if (err) next(err);

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
                if (err) next(err);
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
  } else {
    req.session.errorMessage = 'Please enter email and password';
    return res.redirect('/login');
  }
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
  const isMerchant = req.body.isMerchant === 'merchant';

  if (emailRegexp.test(email) === false) {
    req.session.errorMessage = 'Invalid email';
    req.session.save((err) => {
      if (err) next(err);

      return res.redirect('/register');
    });
  } else if (passwordRegexp.test(password) === false) {
    req.session.errorMessage =
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one number ';
    req.session.save((err) => {
      if (err) next(err);

      return res.redirect('/register');
    });
  } else if (password !== confirmPassword) {
    req.session.errorMessage = 'Passwords do not match';
    req.session.save((err) => {
      if (err) next(err);

      return res.redirect('/register');
    });
  } else {
    try {
      const user = await User.findOne({ email: email });

      console.log('user in db', user);
      if (user) {
        req.session.errorMessage = 'This user already exists.';
        req.session.save((err) => {
          if (err) next(err);
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
          isAdmin: isMerchant,
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
            html: `<h1>Wellcome to my demo project. </h1>
            <p>Your account is successfully created.</p>`,
          };
          sgMail
            .send(msg)
            .then(() => {
              console.log('Email sent');
            })
            .catch((error) => {
              next(error);
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
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;

  res.render('account/reset-password', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: errorMessage,
  });
};

exports.postResetPassword = (req, res, next) => {
  if (!req.body.email) {
    req.session.errorMessage =
      'Error: Please enter your email address to reset your password';

    req.session.save((err) => {
      if (err) next(err);

      return res.redirect('/reset-password');
    });
  } else {
    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset-password');
      }

      const token = buffer.toString('hex');

      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            req.session.errorMessage = 'Error: User not found';
            req.session.save((err) => {
              if (err) next(err);

              return res.redirect('/reset-password');
            });
          } else {
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save((err) => {
              next(err);
            });
          }
        })
        .then((result) => {
          res.redirect('/login');

          // send a confirmation email
          const msg = {
            to: email,
            from: 'erkamguresen@gmail.com', // Change to your verified sender
            subject: 'Reset Password',
            // text: 'and easy to do anywhere, even with Node.js',
            html: `<p>You can now reset your password</p>
            <p>Please click on the link below</p>
            <p>
              <a href="https://online-electronics-shop.herokuapp.com/new-password/${token}">Reset Password</a>
            </p>`,
          };
          sgMail.send(msg);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
  });

  res.redirect('/');
};

exports.getNewPassword = (req, res, next) => {
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;

  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      return res.render('account/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMessage: errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (passwordRegexp.test(password) === false) {
    req.session.errorMessage =
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one number ';
    req.session.save((err) => {
      if (err) next(err);

      return res.redirect(`/new-password/${passwordToken}`);
    });
  } else if (password !== confirmPassword) {
    req.session.errorMessage = 'Passwords do not match';
    req.session.save((err) => {
      if (err) next(err);

      return res.redirect(`/new-password/${passwordToken}`);
    });
  } else {
    let _user;

    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    })
      .then((user) => {
        _user = user;

        return bcrypt.hash(user.email + password + process.env.SALT_SECRET, 12);
      })
      .then((hashedPassword) => {
        _user.password = hashedPassword;
        _user.resetToken = undefined;
        _user.resetTokenExpiration = undefined;

        _user.save().then((result) => {
          res.redirect('/login');
        });
      })
      .catch((err) => {
        next(err);
      });
  }
};
