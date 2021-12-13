const mongoose = require('mongoose');

const errorLogSchema = mongoose.Schema({
  error: {
    type: Object,
    required: true,
  },
  // request: {
  //   type: Object,
  //   required: true,
  // },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);
