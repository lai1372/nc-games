const { fetchReviews } = require("../models/reviews.models");

exports.getReviews = (request, response, next) => {
  const reviewId = request.params.review_id;
  fetchReviews(reviewId)
    .then((review) => {
      response.status(200).send({ review: review });
    })
    .catch((err) => {
      next(err);
    });
};
