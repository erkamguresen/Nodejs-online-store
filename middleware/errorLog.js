const ErrorLog = require('../models/errorLog');

module.exports = function (error, req, res, next) {
  const errorLog = new ErrorLog({
    message: error.message,
    error: error,
  });

  //TODO image still uploads despite error

  errorLog
    .save()
    .then((result) => {
      res
        .status(500)
        .render('error/500', { title: 'Error', errorMessage: error.message });
    })
    .catch((err) => {
      console.log('errorLog save error', err);
    });
};
