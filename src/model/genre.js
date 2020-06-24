const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

let Genre = mongoose.model("Genre", GenreSchema);
module.exports = Genre;
