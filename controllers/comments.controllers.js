const {
  fetchCommentsByReviewID,
  createCommentByReviewId,
} = require("../models/comments.models.js");

exports.getCommentsByReviewId = (request, response, next) => {
  const reviewId = request.params.review_id;
  fetchCommentsByReviewID(reviewId)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (request, response, next) => {
  const reviewId = request.params.review_id;
  const comment = request.body;
  createCommentByReviewId(reviewId, comment)
    .then((comment) => {
      response.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};
