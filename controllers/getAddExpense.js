const express = require("express");
const mongoose = require("mongoose");

module.exports = (req, res) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stal   e=0, post-check=0, pre-check=0"
  );
  if (req.isAuthenticated()) {
    res.render("addNewExpense", { message: null });
  } else {
    res.redirect("/login");
  }
};
