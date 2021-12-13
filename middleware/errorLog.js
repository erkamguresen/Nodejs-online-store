const ErrorLog = require('../models/errorLog');

module.exports = function (error, req) {
  const errorLog = new ErrorLog({
    message: error.message,
    error: error,
    request: req,
  });

  errorLog.save();
};
