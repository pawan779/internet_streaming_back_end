const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../model/user");

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Email and password is required" });
  }

  const isMatch = await User.findOne({ email });

  if (isMatch) {
    return res.status(409).send({ error: "Email already exists!!" });
  }

  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).send({ error: "Could not hash!" });
      }

      const user = new User({ email, password: hash });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.SECRET);
      res.json({
        token,
        admin: user.isAdmin,
      });
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: "Email and password is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid email or password" });
  }
  try {
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
      return res.status(422).send({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET);
    res.json({
      token,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(422).send({ error: "Invalid email or password" });
  }
});

module.exports = router;