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
        expect(result.body.msg).toEqual("404 - Path not found!");
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
        expect(message).toBe("404 - Path not found!");
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
        expect(result.body.reviews.length).toBe(13);
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
        expect(result.body.reviews.length).toBe(13);
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
        expect(result.body.msg).toBe("404 - Path not found!");
      });
  });
});

describe("GET - /api/reviews/:review_id/comments", () => {
  test("should return status 200 along with an array with correct properties", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((comments) => {
        const commentsArray = comments.body.comments;
        expect(Array.isArray(commentsArray)).toBe(true);
        expect(commentsArray.length).toBe(3);
        return commentsArray.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.review_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
        });
      });
  });
  test("should be sorted by created in ascending order", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((comments) => {
        expect(comments.body.comments).toBeSortedBy("created_at");
      });
  });
  test("should return a 404 error if the correct data type for review ID is added, but there are no corresponding comments", () => {
    return request(app)
      .get("/api/reviews/21/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404 - Path not found!");
      });
  });
  test("should return a 400 error if the data type for review ID is invalid", () => {
    return request(app)
      .get("/api/reviews/notavalidid/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400 - Bad Request!");
      });
  });
});
describe("POST - /api/reviews/:review_id/comments", () => {
  test("should return a 201 along with the posted comment", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "mallionaire",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id pulvinar urna",
      })
      .expect(201)
      .then((comment) => {
        const returnedComment = comment.body.comment;
        expect(returnedComment.author).toBe("mallionaire");
        expect(returnedComment.body).toBe(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id pulvinar urna"
        );
      });
  });
  test("should return a 404 if the review ID added doesnt exist", () => {
    return request(app)
      .post("/api/reviews/45/comments")
      .send({
        username: "mallionaire",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id pulvinar urna.",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "404 - no such review ID found, please use an existing review ID to post a comment"
        );
      });
  });
  test("should return a 404 if the username in the request does not exist in the users database", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "lailacase",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id pulvinar urna.",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404 - Invalid username!");
      });
  });

  test("should return a 400 if the wrong values are sent in the post request", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({ username: 34, body: 54 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400 - Bad Request!");
      });
  });

  test("should return a 400 if the review id that is passed is an invalid data type", () => {
    return request(app)
      .post("/api/reviews/notanid/comments")
      .send({
        username: "mallionaire",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id pulvinar urna.",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400 - Bad Request!");
      });
  });

  test("should return a 400 if the keys on the request do not match 'username' and 'body'", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        notusername: "mallionaire",
        notbody:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id pulvinar urna.",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400 - Bad Request!");
      });
  });
});

describe("PATCH - /api/reviews/:review_id", () => {
  test("should return a 200 status if updated successfully along with the updated review", () => {
    return request(app)
      .patch("/api/reviews/5")
      .send({ inc_votes: 10 })
      .expect(200)
      .then((response) => {
        const updatedReview = response.body.updated_review;
        expect(updatedReview).toEqual({
          review_id: 5,
          title: "Proident tempor et.",
          category: "social deduction",
          designer: "Seymour Buttz",
          owner: "mallionaire",
          review_body:
            "Labore occaecat sunt qui commodo anim anim aliqua adipisicing aliquip fugiat. Ad in ipsum incididunt esse amet deserunt aliqua exercitation occaecat nostrud irure labore ipsum. Culpa tempor non voluptate reprehenderit deserunt pariatur cupidatat aliqua adipisicing. Nostrud labore dolor fugiat sint consequat excepteur dolore irure eu. Anim ex adipisicing magna deserunt enim fugiat do nulla officia sint. Ex tempor ut aliquip exercitation eiusmod. Excepteur deserunt officia voluptate sunt aliqua esse deserunt velit. In id non proident veniam ipsum id in consequat duis ipsum et incididunt. Qui cupidatat ea deserunt magna proident nisi nulla eiusmod aliquip magna deserunt fugiat fugiat incididunt. Laboris nisi velit mollit ullamco deserunt eiusmod deserunt ea dolore veniam.",
          review_img_url:
            "https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg?w=700&h=700",
          created_at: "2021-01-07T09:06:08.077Z",
          votes: 15,
        });
      });
  });
  test("should return a 404 error if the review ID provided does not exist", () => {
    return request(app)
      .patch("/api/reviews/29")
      .send({ inc_votes: 10 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404 - Path not found!");
      });
  });
});
