const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const connectFlash = require("connect-flash");

module.exports = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
});
