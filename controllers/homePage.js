const express = require("express");
const mongoose = require("mongoose");

module.exports = (req, res) => {
  var loggedIn = 0;
  if (req.isAuthenticated()) {
    loggedIn = 1;
  }
  res.render("index", { loggedIn });
};
