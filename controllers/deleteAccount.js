const User = require("../database/user.js");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

module.exports = (req, res) => {
  const user = req.session.passport.user;
  User.deleteOne({ username: user }).exec().then();
  res.redirect("/logout");
};
