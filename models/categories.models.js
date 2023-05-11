const db = require("../db/connection.js");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((categories) => {
    if (categories.rows.length === 0){
      return Promise.reject({status: 404, msg: "No categories found"})
    }
    return categories.rows;
  });
};
