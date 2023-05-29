const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const Expense = require("../database/expense.js");

module.exports = (req, res) => {
  const id = req.params.id;
  const date = req.params.date;
  const user = req.session.passport.user;
  Expense.findOneAndUpdate(
    {
      email: user,
      "expense.date": date,
    },
    {
      $pull: {
        "expense.$.content": { _id: id },
      },
    },
    { new: true }
  )
    .exec()
    .then(() => {
      res.redirect("/getexpense");
    });
};
