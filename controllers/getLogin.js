const express = require("express");
const mongoose = require("mongoose");
const connectFlash = require("connect-flash");

module.exports = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index");
  } else {
    if (req.flash("error")[0])
      res.render("login", { message: "Password or username is incorrect" });
    else res.render("login", { message: null });
  }
};
