const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

process.env.NODE_ENV = "test";

const b2 = {
    "isbn": "7813461518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
  };

const b3 = {
    "isbn": "7813461518",
    "amazon_url": "http://a.co/eobPtX2"
  };

describe("Book Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM books");

    let b1 = await Book.create({
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
      });
  });

  /** GET / => {books: [book, ...]}  */

  describe("GET /", function () {
    test("can get all books", async function () {
      let response = await request(app).get("/");

      expect(response.books[0]).toEqual(b1);
    });
  });

  /** GET /[id]  => {book: book} */

  describe("GET /:id", function () {
    test("can get a book using id", async function () {
      let response = await request(app).get("/"+b1.isbn);

      expect(response.book).toEqual(b1);
    });
  });

  /** POST /   bookData => {book: newBook}  */

  describe("POST /", function () {
    test("can add valid book", async function () {
      let response = await request(app)
        .post("/")
        .send(b2);

      expect(reponse.statusCode).toEqual(201);
      expect(reponse.book).toEqual(b2);
    });

    test("won't add invalid book", async function () {
      let response = await request(app)
        .post("/")
        .send(b3);

      expect(response.statusCode).toEqual(400);
    });
  });

    /** PUT /[isbn]   bookData => {book: updatedBook}  */

    describe("POST /:isbn", function () {
        test("can update valid book", async function () {
          let response = await request(app)
            .post("/"+b2.isbn)
            .send(b2);
    
          expect(reponse.statusCode).toEqual(201);
          expect(reponse.book).toEqual(b2);
        });
    
        test("won't add invalid book", async function () {
          let response = await request(app)
            .post("/"+b2.isbn)
            .send(b3);
    
          expect(response.statusCode).toEqual(400);
        });
      });

});

afterAll(async function () {
  await db.end();
});
