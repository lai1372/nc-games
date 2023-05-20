const db = require("./db/connection.js");

exports.checkReviewIdExists = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
    .then((review) => {
      if (review.rows.length === 0 && reviewId) {
        return Promise.reject({
          status: 404,
          msg: "404 - no such review ID found, please use an existing review ID to post a comment",
        });
      }
    });
};

exports.checkUsernameExists = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((usernames) => {
      if (usernames.rows.length === 0 && username) {
        return Promise.reject({
          status: 404,
          msg: "404 - Invalid username!",
        });
      }
    });
};

exports.checkDataisString = (author, body) => {
  if (typeof author !== "string" && author) {
    return Promise.reject({ status: 400, msg: "400 - Bad Request!" });
  }
  if (typeof body !== "string" && body) {
    return Promise.reject({ status: 400, msg: "400 - Bad Request!" });
  }
};

exports.createQuery = (author, body, reviewId) => {
  return db.query(
    `INSERT INTO comments
(author, body, review_id)
VALUES ($1, $2, $3) RETURNING *`,
    [author, body, reviewId]
  );
};

exports.checkKeysExist = (comment) => {
  if (!comment.username) {
    return Promise.reject({ status: 400, msg: "400 - Bad Request!" });
  }
  if (!comment.body) {
    return Promise.reject({ status: 400, msg: "400 - Bad Request!" });
  }
};

exports.checkCommentIdExists = (commentId) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then((comments) => {
      if (comments.rows.length === 0 && commentId) {
        return Promise.reject({ status: 404, msg: "404 - Path not found!" });
      }
    });
};
