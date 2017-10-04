"use strict";

const express = require("express");
const knex = require("../knex");
const humps = require("humps");
const bcrypt = require('bcrypt-as-promised');

let router = express.Router();

// YOUR CODE HERE
router.post("/", (req, res, next) => {
  let newUser = req.body;

  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      newUser.hashed_password = hashed_password;
      delete newUser.password;
      newUser = humps.decamelizeKeys(newUser);
      return knex("users").insert(newUser, "*");
    })
    .then((users) => {
      delete users[0].hashed_password;
      res.send(humps.camelizeKeys(users[0]));
    })
    .catch((err) => next(err));
});

module.exports = router;
