const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");

const authRoute = require("./src/routes/auth");
const movieRoute = require("./src/routes/movie");
const genreRoute = require("./src/routes/genre");
const uploadRoute = require("./src/routes/upload");
const favouriteRoute = require("./src/routes/favourite");

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// mongodb connection
const mongoUri = process.env.MONGODB;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongodb");
});

mongoose.connection.on("error", (err) => {
  console.log("Unable to connect to mongodb");
});

app.use("/", authRoute);
app.use("/movie", movieRoute);
app.use("/genre", genreRoute);
app.use("/", uploadRoute);
app.use("/favourite", favouriteRoute);

// server connection
app.listen(process.env.PORT, () => {
  console.log(`Connected on port ${process.env.PORT}`);
});
