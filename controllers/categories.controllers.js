const { fetchCategories } = require("../models/categories.models");

exports.getCategories = (request, response) => {
  fetchCategories()
    .then((result) => {
      response.status(200).send({ result: result });
    })
    .catch(() => {
      response.status(500).send({ msg: "An internal error has occurred" });
    });
};
