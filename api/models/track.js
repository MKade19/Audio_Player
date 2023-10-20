const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Track = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },
    audioUrl: {
      type: String,
      unique: true,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    listensQuantity: {
      type: Number,
      required: true
    },
    uploadedBy: {
      type: String,
      required: true
    },
    usersWhoLiked: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('track', Track);