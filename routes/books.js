"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const knex = require("../knex");
const humps = require("humps");
const boom = require('boom');

let router = express.Router();

router.get("/", (req, res, next) => {
  knex("books")
    .orderBy("title")
    .then((books) => res.status(200).send(humps.camelizeKeys(books)))
    .catch((err) => next(err))
});

router.get("/:id", (req, res, next) => {
  if (isNaN(req.params.id)) res.sendStatus(404);

  knex("books")
    .where("id", req.params.id)
    .first()
    .then(requestedBook => !requestedBook ? next() : res.send(humps.camelizeKeys(requestedBook)))
    .catch((err) => next(err))
});

router.post("/", (req, res, next) => {
  let newBook =  humps.decamelizeKeys(req.body);

  let validColumnNamesInTableBooks = {title : "Title",
                                      author : "Author",
                                      genre : "Genre",
                                      description : "Description",
                                      cover_url : "Cover URL"};

  for (let key in validColumnNamesInTableBooks) {
    if (!newBook.hasOwnProperty(key) || (newBook[key] == ""))
      return next(res.set("Content-Type", "text/plain").status(400).send(`${validColumnNamesInTableBooks[key]} must not be blank`));
  }

  knex("books")
    .insert(newBook, "*")
    .then((newNewBook) => res.send(humps.camelizeKeys(newNewBook[0])))
    .catch((err) => next(err))
});

router.patch("/:id", (req, res, next) => {
  if (isNaN(req.params.id)) return next(res.set("Content-Type", "text/plain").status(404).send("Not Found"));

  let requestedID = Number.parseInt(req.params.id);

  knex("books")
    .where("id", requestedID)
    .first()
    .update(humps.decamelizeKeys(req.body), "*")
    .then((selectedBook) => res.status(200).send(humps.camelizeKeys(selectedBook[0])))
    .catch((err) => next(res.set("Content-Type", "text/plain").status(404).send("Not Found")));
});

router.delete("/:id", (req, res, next) => {
  let requestedID = Number.parseInt(req.params.id);
  let deletedBook;

  knex("books")
    .where("id", requestedID)
    .first()
    .then((requestedBook) => {
      if (!requestedBook) return next();

      deletedBook = requestedBook;

      return knex('books')
        .del()
        .where('id', requestedID)
    })
    .then(() => {
      delete deletedBook.id;
      res.set("Content-Type", "application/json").send(humps.camelizeKeys(deletedBook));
    })
    .catch((err) => {
      if (isNaN(req.params.id)) return next(res.set("Content-Type", "text/plain").status(404).send("Not Found"));
    })

});

module.exports = router;
