const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const playbackSchema = new mongoose.Schema({
    started: {
      type: Date,
      default: Date.now
    },
    subsciber1: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: 'You must supply a subscriber one!'
    },
    subsciber2: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply a subscriber two!'
    },
    movie: {
      type: mongoose.Schema.ObjectId,
      ref: 'Movie',
      required: 'You must supply a movie!'
    },
    timeElapsedinSeconds: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: false
    }
  });


  module.exports = mongoose.model('Playback', playbackSchema);
