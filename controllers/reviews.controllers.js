const { query } = require("../db/connection");
const {
  fetchReviewsById,
  fetchReviews,
  updateReviewsById,
} = require("../models/reviews.models");

exports.getReviewsById = (request, response, next) => {
  const reviewId = request.params.review_id;
  fetchReviewsById(reviewId)
    .then((review) => {
      response.status(200).send({ review: review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (request, response, next) => {
  if (Object.values(request.query).length > 0) {
    fetchReviews(request.query)
      .then((queriedReviews) => {
        response.status(200).send({ filtered_reviews: queriedReviews });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    fetchReviews()
      .then((reviews) => {
        response.status(200).send({ reviews: reviews });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.patchReviewsById = (request, response, next) => {
  const reviewId = request.params.review_id;
  const votes = request.body;
  updateReviewsById(votes, reviewId)
    .then((updatedReview) => {
      response.status(200).send({ updated_review: updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};
