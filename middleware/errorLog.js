const ErrorLog = require('../models/errorLog');

module.exports = function (error, req, res, next) {
  const errorLog = new ErrorLog({
    message: error.message,
    error: error,
    // request: req,
  });

  console.log('errorLog', errorLog);

  errorLog
    .save()
    .then((result) => {
      console.log('errorLog saved', result);
      res
        .status(500)
        .render('error/500', { title: 'Error', errorMessage: error.message });
    })
    .catch((err) => {
      console.log('errorLog save error', err);
    });
};
