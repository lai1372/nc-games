const db = require("../db/connection.js");

exports.fetchReviews = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found!" });
      }
      console.log(result.rows[0]);
      return result.rows[0];
    });
};
