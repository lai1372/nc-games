const { fetchCommentsByReviewID
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
