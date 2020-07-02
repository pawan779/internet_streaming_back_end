const express = require("express");
const Genre = require("../model/genre");
const requiredAuth=require("../middleware/requireAuth")
const router = express.Router();

// add new genre
router
  .route("/")
  .post(requiredAuth.verifyAdmin, async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(422).send({ error: "Genre Name is required" });
    }

    const isMatch = await Genre.findOne({ name });

    if (isMatch) {
      return res.status(409).send({ error: "Genre already exists!!" });
    }
    try {
      const genre = await Genre.create({ name });
      res.json(genre);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!!" });
    }
  })
  //to get all genre
  .get( async (req, res) => {
    try {
      const genre = await Genre.find({});
      res.json(genre);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!!" });
    }
  });
router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const genre = await Genre.findById({ _id: id });
      res.json(genre);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!!" });
    }
  })
  .put(requiredAuth.verifyAdmin, async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(422).send({ error: "Genre Name is required" });
    }

    const isMatch = await Genre.findOne({ name });
    if (isMatch) {
      return res.status(409).send({ error: "Genre already exists!!" });
    }

    try {
      const response = await Genre.findByIdAndUpdate({ _id: id }, { name });
      const genre = await Genre.findOne({ _id: id });
      res.json(genre);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!!" });
    }
  })
  .delete(requiredAuth.verifyAdmin, async (req, res) => {
    console.log(req.params.id)
    const { id } = req.params;
    try {
      const genre = await Genre.findByIdAndDelete({ _id: id });
      res.json({ message: "Delete sucessfully" });
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!!" });
    }
  });

module.exports = router;
