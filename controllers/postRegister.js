const User = require("../database/user.js");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const connectFlash = require("connect-flash");

module.exports = (req, res) => {
  const x = req.body.password;
  const y = req.body.pass;
  if (x != y) {
    res.redirect("/register");
  } else {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (error, user) {
        if (error) {
          req.flash("registrationErrors", "User already exists");
          res.render("register", { message: req.flash("registrationErrors") });
        } else {
          passport.authenticate("local")(req, res, function () {
            req.flash("registrationErrors", null);
            res.redirect("/");
          });
        }
      }
    );
  }
};
