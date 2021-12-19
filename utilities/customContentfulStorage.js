const {
  uploadFile,
  //   getFileURL,
  deleteFile,
} = require('./mediaStorage');

function CustomContentfulStorage(options) {
  this.options = options;
  // this.client = contentful.createClient(options);
}

CustomContentfulStorage.prototype._handleFile = function _handleFile(
  req,
  file,
  cb
) {
  //   uploadFile(
  //     options.filename(req, file, cb),
  //     'automaticly uploaded file',
  //     'image/jpeg',
  //     options.filename(req, file, cb),
  //     file.buffer
  //   );
  return console.log('handleFile options', this.options.filename);
};

CustomContentfulStorage.prototype._removeFile = function _removeFile(
  req,
  file,
  cb
) {
  console.log('handleFile options', this.options);
};

module.exports = function (options) {
  return new CustomContentfulStorage(options);
};
