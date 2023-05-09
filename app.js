const express = require("express");
const { getCategories } = require("./controllers/getCategories.controllers.js");
const app = express();

app.get("/api/categories", getCategories);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "An invalid path was entered" });
});

module.exports = app;
