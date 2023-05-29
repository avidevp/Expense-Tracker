const mongoose = require("mongoose")
const passportLocalMongooose = require("passport-local-mongoose")
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  });
userSchema.plugin(passportLocalMongooose);

const User = new mongoose.model("user", userSchema);



module.exports = User

