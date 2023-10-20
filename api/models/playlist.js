const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Playlist = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  trackList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'track',
      required: true
    }
  ]
})

module.exports = mongoose.model('playlist', Playlist);

