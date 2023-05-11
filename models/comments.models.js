const db = require("../db/connection.js");

exports.fetchCommentsByReviewID = (reviewId) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at`, [
      reviewId,
    ])
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404 - no comments found with this review ID",
        });
      }
      return comments.rows;
    });
};
