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
  let tableColumnNames = ["title", "author", "genre", "description", "cover_url"];

  for (let key of tableColumnNames) {
    if (!newBook.hasOwnProperty(key)) next();
  }

  knex("books")
    .insert(newBook, "*")
    .then((newNewBook) => res.send(humps.camelizeKeys(newNewBook[0])))
    .catch((err) => next(err))
});

router.patch("/:id", (req, res, next) => {
  let requestedID;

  isNaN(req.params.id) ? res.sendStatus(400) : requestedID = Number.parseInt(req.params.id)

  knex("books")
    .where("id", requestedID)
    .first()
    .update(humps.decamelizeKeys(req.body), "*")
    .then((requestedBook) => res.send(humps.camelizeKeys(requestedBook[0])))
    .catch((err) => next(err))
});

router.delete("/:id", (req, res, next) => {
  let requestedBook;

  isNaN(req.params.id) ? res.sendStatus(400) : requestedID = Number.parseInt(req.params.id)

  knex("books")
    .where("id", req.params.id)
    .first()
    .then((selectedBook) => !selectedBook ? next() : requestedBook = selectedBook)
    .then(() => {
      delete requestedBook.id;
      res.send(humps.camelizeKeys(requestedBook));
    })
    .catch((err) => next(err))
});

module.exports = router;
