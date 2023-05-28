const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongooose = require("passport-local-mongoose");
const path = require("path");
const moment = require("moment/moment");
const app = express();
const methodOverride = require("method-override");
const connectFlash = require("connect-flash");

app.use(express.static(__dirname));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: "wfwr89f59w98w1f981W98F1W988",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());

mongoose.connect("mongodb://127.0.0.1:27017/expenseDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

const expenseSchema = new mongoose.Schema({
  email: String,
  // total: { type: Number, required: true, default: 10000 },
  expense: {
    type: [
      {
        date: Date,
        content: [
          {
            description: String,
            amount: Number,
          },
        ],
      },
    ],
    required: true,
  },
});
userSchema.plugin(passportLocalMongooose);
const User = new mongoose.model("user", userSchema);
const Expense = new mongoose.model("expense", expenseSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// const expense = new Expense({
//   email: "baba@123.com",
//   password: "baba",
//   total: 151651,
//   expense: {
//     date: new Date(),
//     content: ["5215125","8888"]
//   }
// });
// expense.save();

app.get("/", function (req, res) {
  var loggedIn = 0;
  if (req.isAuthenticated()) {
    loggedIn = 1;
  }
  res.render("index", { loggedIn });
});
app.get("/index", function (req, res) {
  var loggedIn = 0;
  if (req.isAuthenticated()) {
    loggedIn = 1;
  }
  res.render("index", { loggedIn });
});
app.get("/register", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("index");
  } else res.render("register", { message: null });
});
app.get("/login", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("index");
  } else {
    if (req.flash("error")[0])
      res.render("login", { message: "Password or username is incorrect" });
    else res.render("login", { message: null });
  }
});

app.get("/addexpense", function (req, res) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stal   e=0, post-check=0, pre-check=0"
  );
  if (req.isAuthenticated()) {
    res.render("addNewExpense", { message: null });
  } else {
    res.redirect("/login");
  }
});
app.post("/addexpense", function (req, res) {
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
  res.redirect("/");
});

app.post("/register", function (req, res) {
  const x = req.body.password;
  const y = req.body.pass;
  if (x != y) {
    res.redirect("/register");
  } else {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (error, user) {
        if (error) {
          req.flash("registrationErrors", "User already exists");
          res.render("register", { message: req.flash("registrationErrors") });
        } else {
          passport.authenticate("local")(req, res, function () {
            req.flash("registrationErrors", null);
            res.redirect("/");
          });
        }
      }
    );
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/getexpense", function (req, res) {
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
});

app.delete("/row/:id/:date", function (req, res) {
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
    .then((docs) => {
      res.redirect("/getexpense");
    });
});
app.delete("/delete/account", function (req, res) {
  const user = req.session.passport.user;
  User.deleteOne({ username: user }).exec().then();
  res.redirect("/logout");
});
app.post("/delete/date/:date", function (req, res) {
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
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(process.env.PORT || 3000);
