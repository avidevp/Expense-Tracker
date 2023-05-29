const User = require("../database/user.js");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const Expense = require("../database/expense.js");

module.exports = (req, res) => {
  const user = req.session.passport.user;
  User.deleteOne({ username: user }).exec().then(
  Expense.findOneAndRemove({email:user}).exec().then()
  );
  res.redirect("/logout");
};
