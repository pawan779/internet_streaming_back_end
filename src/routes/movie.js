const express = require("express");
const router = express.Router();
const Movie = require("../model/movie");
const mongoose = require("mongoose");
const User = require("../model/user");
const Genre = require("../model/genre");
const requireAuth = require("../middleware/requireAuth");

router.get("/", requireAuth, async (req, res) => {
    
  try {
    const response = await Movie.find({});
    res.json(response);
  } catch (err) {
    return res.status(500).send({ error: "Something went wrong!" });
  }
});

module.exports = router;
