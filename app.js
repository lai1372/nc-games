const express = require("express");
const { getCategories } = require("./controllers/categories.controllers.js");
const {
  getReviewsById,
  getReviews,
  getReviewIdComments,
} = require("./controllers/reviews.controllers.js");
const { getEndpoints } = require("./controllers/endpoints.controllers.js");
const {
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("./controllers/comments.controllers.js");
const utilityFunctions = require("./utilities.js")
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.get("/api", getEndpoints);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "404 - Path not found!" });
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "400 - Bad Request!" });
  } else {
    next(err);
  }
});


app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next();
  }
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "500 - A server error has occurred!" });
});

module.exports = app;
