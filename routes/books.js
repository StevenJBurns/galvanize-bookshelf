"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const humps = require("humps");
const knex = require("../knex");

const router = express.Router();

router.get("/", (req, res, next) => {
  knex("books")
    .orderBy("title")
    .then((books) => res.status(200).send(humps.camelizeKeys(books)))
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  knex("books")
    .where("id", req.params.id)
    .first()
    .then(requestedBook => !requestedBook ? next() : res.send(humps.camelizeKeys(requestedBook)))
    .catch((err) => next(err))
});

router.post("/", (req, res, next) => {
  let newBook =  humps.decamelizeKeys(req.body);
  let colNames = ["title", "author", "genre", "description", "cover_url"];

  for (let key of colNames) {
    if (!newBook.hasOwnProperty(key)) next();
  }

  knex("books")
    .insert(newBook, "*")
    .then((newNewBook) => {
      res.send(humps.camelizeKeys(newNewBook[0]))
    })
    .catch((err) => next(err))
});

router.patch("/", (req, res, next) => {

});

router.delete("/", (req, res, next) => {

});

// YOUR CODE HERE

module.exports = router;
