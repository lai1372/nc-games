const db = require("../db/connection.js");
const {
  checkReviewIdExists,
  checkUsernameExists,
  checkDataisString,
  createQuery,
  checkKeysExist,
  checkCommentIdExists,
} = require("../utilities.js");

exports.fetchCommentsByReviewID = (reviewId) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at`, [
      reviewId,
    ])
    .then((comments) => {
      if (comments.rows.length === 0) {
        return comments.rows;
      }
      return comments.rows;
    });
};

exports.createCommentByReviewId = (reviewId, comment) => {
  const author = comment.username;
  const body = comment.body;
  const reviewIdCheck = checkReviewIdExists(reviewId);
  const usernameCheck = checkUsernameExists(author);
  const checkString = checkDataisString(author, body);
  const checkKeys = checkKeysExist(comment);
  return Promise.all([
    reviewIdCheck,
    usernameCheck,
    checkKeys,
    checkString,
  ]).then(() => {
    return createQuery(author, body, reviewId).then((comment) => {
      return comment.rows[0];
    });
  });
};

exports.deleteCommentById = (commentId) => {
  return checkCommentIdExists(commentId).then(() => {
    return db
      .query(`DELETE FROM comments WHERE comment_id = $1`, [commentId])
      .then(() => {
        return;
      });
  });
};
