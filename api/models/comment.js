const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment = new Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  trackId: {
    type: Schema.Types.ObjectId,
    ref: 'track',
    required: true
  },
});

module.exports = mongoose.model('comment', Comment);