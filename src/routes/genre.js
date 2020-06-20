const express = require("express");
const Gnere = require("../model/genre");
const requireAuth = require("../middleware/requireAuth");
const Genre = require("../model/genre");
const router = express.Router();

// add new genre
router
  .route("/")
  .post(requireAuth, async (req, res) => {
    const { name } = req.body;

    const isMatch = await Gnere.findOne({ name });

    if (isMatch) {
      res.status(409).send({ error: "Genre already exists!!" });
    }
    try {
      const genre = await Gnere.create({ name });
      res.json(genre);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!!" });
    }
  })
 

module.exports = router;
