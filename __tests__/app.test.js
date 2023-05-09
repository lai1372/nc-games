const app = require("../app.js");
const request = require("supertest");
const express = require("express");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET - /api/categories", () => {
  test("should return a 200 if successful, check for correct length and data types", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((result) => {
        const categories = result.body.result;
        expect(categories.length).toBe(4);
        return categories.forEach((category) => {
          expect(typeof category.slug).toBe("string");
          expect(typeof category.description).toBe("string");
        });
      });
  });
});

describe("GET - 404 bad endpoint", () => {
  test("Should return a 404 if an incorrect endpoint is entered", () => {
    return request(app)
      .get("/api/random")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toEqual("An invalid path was entered");
      });
  });
});
