const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../model/user");
const requireAuth = require("../middleware/requireAuth");

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
    const isMatch = await bcrypt.compare(password, user.password);
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

router
  .route("/me")
  .get(requireAuth.verifyUser, async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id });
      res.json(user);
    } catch (err) {
      res.status(422).send({ error: "No user found" });
    }
  })

  .put(requireAuth.verifyUser, async (req, res) => {
    const { name, address, phone, image } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { name, address, phone, image }
      );

      const response = await User.findOne({ _id: req.user.id });

      res.json(response);
    } catch (err) {
      res.status(406).send("Unauthorized");
    }
  });

//find all users

router.get(
  "/user/all",
  requireAuth.verifyUser,
  requireAuth.verifyAdmin,
  async (req, res) => {
    const user = await User.find({ isAdmin: false }).sort({ _id: -1 });
    res.json(user);
  }
);

//to get user by id

router
  .route("/user/:id")
  .get(requireAuth.verifyUser, requireAuth.verifyAdmin, async (req, res) => {
    try {
      const user = await User.findById({ _id: req.params.id });
      res.json(user);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong!" });
    }
  })
  .put(requireAuth.verifyUser, requireAuth.verifyAdmin, async (req, res) => {
    const { name, address, phone, image } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { name, address, phone, image }
      );

      const response = await User.findOne({ _id: req.params.id });

      res.json(response);
    } catch (err) {
      res.status(406).send("Unauthorized");
    }
  })
  .delete(requireAuth.verifyUser, requireAuth.verifyAdmin, async (req, res) => {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    res.json({ message: "Deleted Sucessfully!!" });
  });

//to change password

router.post("/change", requireAuth.verifyUser, async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });

  if (!user) {
    return res.status(404).send({ error: "No user found" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res.status(422).send({ error: "Password donot match" });
  }
  //if matched changed the password
  let newPwd = req.body.newPassword;
  await bcrypt.hash(newPwd, 10, async (err, hash) => {
    if (err) {
      let err = new Error("Could not hash!");
      err.status = 500;
      return next(err);
    }

    user.password = hash;
    await user.save();
    res.json({ message: "Password changed" });
  });
});
module.exports = router;
