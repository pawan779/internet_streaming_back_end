const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = mongoose.model("User");

module.exports = (req, res, next) => {
  //automatically convert to small letter Authorizatiom
  const { authorization } = req.headers;

  //autorization ==='Bearer dsfkjlsdfsdkfklsdf'

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in" });
    }
    const { userId } = payload;

    const user = await User.findById(userId);

    req.user = user;
    next();
  });
};


