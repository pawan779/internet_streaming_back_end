const express = require("express");
const router = express.Router();
const Movie = require("../model/movie");
const mongoose = require("mongoose");
const User = require("../model/user");
const Genre = require("../model/genre");
const requireAuth = require("../middleware/requireAuth");
const Favourite = require("../model/favourite");

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
    console.log(req.body);
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
      res.json(data);
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

//get favourites movie

router.get("/favourite/movie", requireAuth, async (req, res) => {
  const fav = await Favourite.findOne({ user: req.user.id });

  try {
    if (fav == null) {
      console.log("no user");
      return res.status(404).send({ error: "Favourite not found" });
    }
    const find = await Movie.find({ "genre._id": fav.genre });
    return res.json(find);
  } catch (err) {
    return res.status(500).send({ error: "Something went wrong!" });
  }
});

//serach for movie

router.get("/search/:id", requireAuth, async (req, res) => {
  let search = req.params.id;
  try {
    const result = await Movie.find({
      $or: [
        { name: { $regex: search } },
        { description: { $regex: search } },
        { image: { $regex: search } },
        { video: { $regex: search } },
        { duration: { $regex: search } },
        { release: { $regex: search } },
      ],
    });
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: `Search Result for ${search}: Not found` });
  }
});

// for addming review
router
  .route("/review/:id")
  .post(requireAuth, async (req, res) => {
    const { message, rating } = req.body;
    try {
      let movie = await Movie.findOne({ _id: req.params.id });

      if (movie) {
        movie.review.push({ userId: req.user._id, message, rating });

        const newRating = parseFloat(movie.rating) * (movie.review.length - 1);
        const totalRating = newRating + parseFloat(rating);
        const finalRating = totalRating / movie.review.length;

        movie = await movie.save();
        await movie.updateOne({ rating: finalRating });
        const result = await Movie.findOne({ _id: req.params.id });
        return res.status(201).send(result);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  })
  .get(requireAuth, async (req, res) => {
    const movie = await Movie.findOne({ _id: req.params.id });
    if (!movie) {
      return res.status(404).send({ error: "Not found" });
    }
    try {
      const user = await User.findOne({ _id: movie.review.userId });
      res.json(user);
    } catch (err) {
      console.log(err);
    }
  });

//to update views

router.put("/views/:id", requireAuth, async (req, res) => {
  try {
    const response = await Movie.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
    const result = await Movie.findOne({ _id: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/trending", requireAuth, async (req, res) => {
  const sort = { views: 1 };
  const movie = await Movie.find({}).sort(sort);
  res.json(movie);
});

//find all the movie with category

router.get("/category/:id", async (req, res) => {
  const movie = await Movie.find({ "category.categoryId": req.params.id });
  res.json(movie);
});

module.exports = router;
