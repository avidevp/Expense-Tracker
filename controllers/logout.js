const express = require("express");
const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
