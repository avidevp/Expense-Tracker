const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const Expense = require("../database/expense.js");

module.exports = (req, res) => {
  const date = req.params.date;
  const user = req.session.passport.user;
  Expense.findOneAndUpdate(
    {
      email: user,
    },
    {
      $pull: { expense: { date: date } },
    },
    { new: true }
  )
    .exec()
    .then((docs) => {
      res.redirect("/getexpense");
    });
};
