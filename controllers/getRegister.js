const express = require("express");
const mongoose = require("mongoose");

module.exports = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index");
  } else res.render("register", { message: null });
};
