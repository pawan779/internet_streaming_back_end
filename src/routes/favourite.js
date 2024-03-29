const express = require("express");
const User = require("../model/user");
const Favourite = require("../model/favourite");
const router = express.Router();

router
  .route("/")
  .post( async (req, res) => {
    const user = await Favourite.findOne({ user: req.user.id });
    try {
      if (user) {
        user.genre = req.body;
        await user.save();
        return res.json(user);
      }
      const fav = new Favourite();
      fav.user = req.user.id;
      fav.genre = req.body;
      await fav.save();
      res.json(fav);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!" });
    }
  })
  .get( async (req, res) => {
    const fav = await Favourite.findOne({ user: req.user.id });
    if (fav.length < 1) {
      return res.status(404).send({ error: "Favoourites not found" });
    }
    res.json(fav);
  });

module.exports = router;
