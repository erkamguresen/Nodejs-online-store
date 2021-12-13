const mongoose = require('mongoose');

const errorLogSchema = mongoose.Schema({
  error: {
    type: Object,
    required: true,
  },
  req: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);
