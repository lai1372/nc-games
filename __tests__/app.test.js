const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const { expect, test } = require("@jest/globals");
const endpoints = require("../endpoints.json");

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

describe("GET - 404 endpoint not found", () => {
  test("Should return a 404 if a non-existent endpoint is entered", () => {
    return request(app)
      .get("/api/random")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toEqual("An invalid path was entered");
      });
  });
});

describe("GET - /api", () => {
  test("should respond with an object detailing which endpoints can be used", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((endpointsjson) => {
        const result = endpointsjson.body.result;
        expect(result).toEqual(endpoints);
      });
  });
  test("should contain the correct keys on the returned object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((endpointsjson) => {
        const result = endpointsjson.body.result;
        expect(result).toHaveProperty("GET /api");
        expect(result).toHaveProperty("GET /api/categories");
      });
  });
});
