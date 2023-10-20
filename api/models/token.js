const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Token = new Schema({
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
  }
});

module.exports = mongoose.model('token', Token);