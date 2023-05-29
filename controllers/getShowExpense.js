const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const connectFlash = require("connect-flash");
const Expense = require("../database/expense.js");
const moment = require("moment");

module.exports = (req, res) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stal   e=0, post-check=0, pre-check=0"
  );
  if (req.isAuthenticated()) {
    Expense.findOne({ email: req.session.passport.user })
      .exec()
      .then((docs) => {
        if (docs && docs.expense.length) {
          var unsorted = docs.expense.map((item) => {
            return {
              date: moment(item.date).format("YYYY-MM-DD"),
              content: [...item.content],
            };
          });
          unsorted.sort(function (a, b) {
            return moment(a.date) - moment(b.date);
          });
          req.flash("noData", "");
          res.render("viewExpense", { expense: unsorted });
        } else {
          req.flash("noData", "No data present");
          res.render("addNewExpense", { message: req.flash("noData") });
        }
      });
  } else {
    res.redirect("/login");
  }
};
