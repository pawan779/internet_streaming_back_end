const express = require("express");
const router = express.Router();
const Movie = require("../model/movie");
const mongoose = require("mongoose");
const User = require("../model/user");
const Genre = require("../model/genre");
const requireAuth = require("../middleware/requireAuth");

router
  .route("/")
  .get(requireAuth, async (req, res) => {
    try {
      const response = await Movie.find({});
      res.json(response);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!" });
    }
  })
  .post(requireAuth, async (req, res) => {
    //to add new movie
    const {
      name,
      description,
      actor,
      duration,
      release,
      image,
      video,
      genre,
    } = req.body;
    try {
      const movie = await Movie.create(req.body);
      res.json(movie);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!" });
    }
  });

//get movie by id

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const data = await Movie.findById({ _id: req.params.id });
    res.json({
      data,
    });
  } catch (err) {
    return res.status(500).send({ error: "Something went wrong!" });
  }
});

module.exports = router;
