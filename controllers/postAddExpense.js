const Expense = require("../database/expense.js");
const moment = require("moment");
const express = require("express");
const mongoose = require("mongoose");

module.exports = (req, res) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stal   e=0, post-check=0, pre-check=0"
  );

  Expense.findOne({ email: req.session.passport.user })
    .exec()
    .then((docs) => {
      if (docs) {
        // Expense.findOneAndRemove({ email:req.session.passport.user}).exec().then()
        var existing = docs;
        var flag = 0;

        existing.expense.forEach((element) => {
          var d = moment(element.date);
          d = d.format("YYYY-MM-DD");
          if (d == req.body.date) {
            element.content.push({
              description: req.body.description,
              amount: req.body.amount,
            });
            flag = 1;
          }
        });
        if (!flag) {
          existing.expense = [
            ...docs.expense,
            {
              date: req.body.date,
              content: [
                { description: req.body.description, amount: req.body.amount },
              ],
            },
          ];
        }
        existing.save();
      } else {
        const expense = new Expense({
          email: req.session.passport.user,
          expense: [
            {
              date: req.body.date,
              content: [
                {
                  description: req.body.description,
                  amount: req.body.amount,
                },
              ],
            },
          ],
        });
        expense.save();
      }
    });
  res.redirect("/addexpense");
};
