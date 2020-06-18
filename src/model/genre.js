const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true,
    unique: true,
  },
});

let Genre = mongoose.model("Category",GenreSchema );
module.exports = Genre;
