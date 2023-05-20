const {
  fetchCommentsByReviewID,
  createCommentByReviewId,
  deleteCommentById,
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

exports.removeCommentById = (request, response, next) => {
  const commentId = request.params.comment_id;
  deleteCommentById(commentId)
    .then((result) => {
      response.status(204).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
