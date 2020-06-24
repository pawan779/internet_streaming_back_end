const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  genre: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    },
  ],
});

let Favourite = mongoose.model("Favourite", FavouriteSchema);
module.exports = Favourite;
