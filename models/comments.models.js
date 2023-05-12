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

exports.createCommentByReviewId = (reviewId, comment) => {
  return db
  .query(`SELECT * FROM reviews WHERE review_id = $1`, [
    reviewId,
  ])
  .then((review) => {
    if (review.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "404 - no such review ID found, please use an existing review ID to post a comment"
      });
    }
    const author = comment.username
    const body = comment.body
    if (typeof author !== "string"){
      return Promise.reject({status: 400, msg: "400 - Bad Request!"})
    }
    if (typeof body !== "string"){
     return Promise.reject({status: 400, msg: "400 - Bad Request!"})
    }
    return db
    .query(`
    INSERT INTO comments
    (author, body, review_id)
    VALUES ($1, $2, $3) RETURNING *`, [author, body, reviewId])
    .then((response) => {
      return response.rows[0]
    })
})}