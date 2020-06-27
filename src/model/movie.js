const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  actor: {
    type: String,
  },
  duration: {
    type: String,
  },
  release: {
    type: String,
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  genre: [
    {
      genreId: String,
    },
  ],
  review: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: String,
      rating: Number,
    },
  ],
  rating: {
    type: String,
    default: "0",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

let Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
