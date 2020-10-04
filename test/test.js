const dotenv = require("dotenv");
dotenv.config;
process.env.TESTING = "test";
const path = require("path");
const app = require("../index.js");
const request = require("supertest");
const expect = require("chai").expect;
const conn = require("../TestFolder/dbtest");

let token = "";
let admin = "";
let genre = "";
let movieId = "";

describe("Testing API all routes", () => {
  before(function (done) {
    this.timeout(150000);
    conn
      .connect()
      .then(() => done())
      .catch((err) => done(err));
  });
  after((done) => {
    conn
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });
});

it("Pass, register user", (done) => {
  request(app)
    .post("/signup")
    .send({
      name: "pawan",
      email: "pa1@gmail.com",
      password: "pawan123",
      isAdmin: false,
    })
    .then((res) => {
      expect(res.body).to.contain.property("token");

      done();
    })
    .catch((err) => done(err));
});

it("Pass, user login and get token", (done) => {
  request(app)
    .post("/signin")
    .send({
      email: "pa1@gmail.com",
      password: "pawan123",
    })
    .then((res) => {
      //   expect(res.statusCode).to.equal(200);
      expect(res.body).to.contain.property("token");
      token = `Bearer ${res.body.token}`;

      done();
    })
    .catch((err) => done(err));
});

it("Pass, register admin", (done) => {
  request(app)
    .post("/signup")
    .send({
      email: "admin@admin.com",
      password: "ADmin123",
      isAdmin: true,
    })
    .then((res) => {
      expect(res.body).to.contain.property("token");

      done();
    })
    .catch((err) => done(err));
});

it("Pass, admin login and get token", (done) => {
  request(app)
    .post("/signin")
    .send({
      email: "admin@admin.com",
      password: "ADmin123",
    })
    .then((res) => {
      // expect(res.statusCode).to.equal(200);
      expect(res.body).to.contain.property("token");
      admin = `Bearer ${res.body.token}`;

      done();
    })
    .catch((err) => done(err));
});

it("Pass, get loggedin users details", (done) => {
  request(app)
    .get("/me")
    .set("Authorization", token)
    .then((res) => {
      expect(res.statusCode).to.equal(200);

      done();
    });
});

it("Pass, add new genre", (done) => {
  request(app)
    .post("/genre")
    .set("Authorization", admin)
    .send({
      name: "test genre",
    })
    .then((res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.contain.property("_id");
      genre = res.body._id;
      done();
    });
});

it("Pass, add new movies", (done) => {
  request(app)
    .post("/movie")
    .set("Authorization", admin)
    .send({
      name: "test movie",
      description: "test movie description",
      actor: "test actor",
      duration: "100",
      release: "2020",
      image: "test.jpg",
      video: "test.mp4",
      genre: [{ genreId: genre }],
    })
    .then((res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.contain.property("_id");
      movieId = res.body._id;
      done();
    });
});

it("Pass, get latest movies", (done) => {
  request(app)
    .get("/movie/latest/movie")
    .then((res) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
});

it("Pass, update movies", (done) => {
  request(app)
    .put("/movie/" + movieId)
    .set("Authorization", admin)
    .send({
      name: "test movie updated",
      description: "test movie description updated",
      actor: "test actor",
      duration: "100",
      release: "2020",
      image: "test.jpg",
      video: "test.mp4",
      genre: [{ genreId: genre }],
    })
    .then((res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.contain.property("_id");
      movieId = res.body._id;
      done();
    });
});

it("Pass, delete movie", (done) => {
  request(app)
    .delete("/movie/" + movieId)
    .set("Authorization", admin)

    .then((res) => {
      expect(res.statusCode).to.equal(200);
      done();
    })
    .catch((err) => done(err));
});
