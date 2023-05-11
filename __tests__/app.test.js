const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const { expect, test } = require("@jest/globals");
const endpoints = require("../endpoints.json");
const jestSorted = require("jest-sorted");

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
        const categories = result.body.categories;
        expect(categories.length).toBe(4);
        return categories.forEach((category) => {
          expect(typeof category.slug).toBe("string");
          expect(typeof category.description).toBe("string");
        });
      });
  });
});

describe("GET - 404 endpoint not found", () => {
  test("should return a 404 if a non-existent endpoint is entered", () => {
    return request(app)
      .get("/api/random")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toEqual("404 path not found!");
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

describe("GET - /api/reviews/:review_id", () => {
  test("should return status 200 along with the review object with correct keys and ID if the ID exists", () => {
    return request(app)
      .get("/api/reviews/10")
      .expect(200)
      .then((result) => {
        const review = result.body.review;
        expect(review).toHaveProperty("review_id");
        expect(review.review_id).toBe(10);
        expect(review).toHaveProperty("title");
        expect(review).toHaveProperty("review_body");
        expect(review).toHaveProperty("designer");
        expect(review).toHaveProperty("review_img_url");
        expect(review).toHaveProperty("votes");
        expect(review).toHaveProperty("category");
        expect(review).toHaveProperty("owner");
        expect(review).toHaveProperty("created_at");
      });
  });
  test("should return status 400 if the ID an invalid input", () => {
    return request(app)
      .get("/api/reviews/test")
      .expect(400)
      .then((result) => {
        const message = result.body.msg;
        expect(message).toBe("400 - Bad Request!");
      });
  });
  test("should return a 404 if valid input added but ID doesnt exist", () => {
    return request(app)
      .get("/api/reviews/1045")
      .expect(404)
      .then((result) => {
        const message = result.body.msg;
        expect(message).toBe("ID not found!");
      });
  });
});

describe("GET - /api/reviews", () => {
  test("should return an array", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body.reviews)).toBe(true);
      });
  });
  test("should contain the correct keys and type of values for each review including an additional key of 'comment_count'", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        expect(result.body.reviews.length).toBe(13)
        return result.body.reviews.forEach((review) => {
          expect(typeof review.owner).toBe("string");
          expect(typeof review.title).toBe("string");
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.category).toBe("string");
          expect(typeof review.review_img_url).toBe("string");
          expect(typeof review.created_at).toBe("string");
          expect(typeof review.votes).toBe("number");
          expect(typeof review.designer).toBe("string");
          expect(typeof review.comment_count).toBe("number");
        });
      });
  });
  test("should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        expect(result.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should not have a key of 'review_body' on any of the reviews", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        expect(result.body.reviews.length).toBe(13)
        return result.body.reviews.forEach((review) => {
          expect(review).not.toHaveProperty("review_body");
        });
      });
  });
  test("should return a 404 error if an incorrect path is entered", () => {
    return request(app)
      .get("/api/notreviews")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("404 path not found!");
      });
  });
});
