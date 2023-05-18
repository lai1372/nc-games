const db = require("../db/connection.js");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((categories) => {
    if (categories.rows.length === 0){
      return Promise.reject()
    }
    return categories.rows;
  });
};
