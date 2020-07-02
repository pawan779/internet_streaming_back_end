const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = mongoose.model("User");

module.exports.verifyUser = (req, res, next) => {
  //automatically convert to small letter Authorizatiom
  const { authorization } = req.headers;

  //autorization ==='Bearer dsfkjlsdfsdkfklsdf'

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in" });
  }

  const token = authorization.split(" ")[1];
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

module.exports.verifyAdmin = (req, res, next) => {
  if (!req.user) {
    let err = new Error("Unauthorized");
    err.status = 401;
    return next(err);
  }
  if (req.user.isAdmin !== true) {
    let err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
  next();
};
