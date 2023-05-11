const express = require("express");
const { getCategories } = require("./controllers/categories.controllers.js");
const { getReviews } = require("./controllers/reviews.controllers.js");
const { getEndpoints } = require("./controllers/endpoints.controllers.js");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviews);

app.get("/api", getEndpoints);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "404 path not found!" });
});

app.use((err, request, response, next) => {
  console.log("in psql error handler")
  if (err.code === "22P02") {
    response.status(400).send({ msg: "400 - Bad Request!" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log("in custom error handler")
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next();
  }
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "a server error has occurred!" });
});

module.exports = app;
