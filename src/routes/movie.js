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

    const isMatch = await Movie.findOne({ name });
    if (isMatch) {
      return res.status(409).send({ error: "Movie Name already exists!!" });
    }
    try {
      const movie = await Movie.create(req.body);
      res.json(movie);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!" });
    }
  });

//get movie by id

router
  .route("/:id")
  .get(requireAuth, async (req, res) => {
    try {
      const data = await Movie.findById({ _id: req.params.id });
      res.json({
        data,
      });
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!" });
    }
  })
  .put(requireAuth, async (req, res) => {
    const response = await Movie.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );

    try {
      const result = await Movie.findOne({ _id: req.params.id });
      res.json(result);
    } catch (err) {
      console.log(err);
    }
  })
  .delete(requireAuth, async (req, res) => {
    const response = await Movie.findByIdAndDelete({ _id: req.params.id });
    res.json({
      message: "Deleted Sucessfully",
    });
  });

module.exports = router;
