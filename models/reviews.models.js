const { Query } = require("pg");
const db = require("../db/connection.js");
const { checkValidQueries } = require("../utilities.js");

exports.fetchReviewsById = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject();
      }
      return result.rows[0];
    });
};

exports.fetchReviews = (query) => {
  if (query) {
    if (query.category) {
      const validCategories = [
        "push-your-luck",
        "roll-and-write",
        "strategy",
        "deck-building",
        "hidden-roles",
        "dexterity",
        "engine-building",
        "social deduction",
        "euro game",
      ];
      if (!validCategories.includes(query.category)) {
        return Promise.reject();
      }
      return db
        .query(
          `SELECT * FROM reviews WHERE category = $1
      `,
          [query.category]
        )
        .then((reviewsByCategory) => {
          if (reviewsByCategory.rows.length === 0) {
            return Promise.reject();
          }
          return reviewsByCategory.rows;
        });
    }
    if (Object.keys(query)[0] === "sort_by") {
      if (query.sort_by === "") {
        return db
          .query(`SELECT * FROM reviews ORDER BY created_at DESC`)
          .then((sortedReviews) => {
            if (sortedReviews.rows.length === 0) {
              return Promise.reject();
            }
            return sortedReviews.rows;
          });
      } else {
        return checkValidQueries(query.sort_by).then(()=>{
          return db
          .query(`SELECT * FROM reviews ORDER BY ${query.sort_by}`)
          .then((orderedReviews) => {
            if (orderedReviews.rows.length === 0) {
              return Promise.reject();
            }
            return orderedReviews.rows;
          });
        })
      }
    }
  }

  return db
    .query(
      `SELECT reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, CAST (COUNT (comments.comment_id) AS INT) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY created_at DESC;`
    )
    .then((reviews) => {
      if (reviews.rows.length === 0) {
        return Promise.reject();
      }
      return reviews.rows;
    });
};

exports.updateReviewsById = (votes, reviewId) => {
  if (!votes.inc_votes) {
    return Promise.reject({ status: 400, msg: "400 - Bad Request!" });
  }
  const newVoteNumber = votes.inc_votes;
  const reviewNumber = reviewId;
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*`,
      [newVoteNumber, reviewNumber]
    )
    .then((reviews) => {
      if (reviews.rows.length === 0) {
        return Promise.reject();
      }
      if (reviews.rows[0].votes < 0) {
        reviews.rows[0].votes = 0;
        return db
          .query(`UPDATE reviews SET votes = $1 WHERE review_id = $2`, [
            0,
            reviewId,
          ])
          .then(() => {
            return reviews.rows[0];
          });
      }
      return reviews.rows[0];
    });
};
