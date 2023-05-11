const db = require("../db/connection.js");

exports.fetchReviewsById = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found!" });
      }
      return result.rows[0];
    });
};

exports.fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, CAST (COUNT (comments.comment_id) AS INT) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY created_at DESC;`
    )
    .then((reviews) => {
      if (reviews.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No reviews found!" });
      }
      return reviews.rows;
    });
};
