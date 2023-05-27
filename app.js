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
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "wfwr89f59w98w1f981W98F1W988",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
  expense: [
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
    res.render("index", { loggedIn: 1 });
  } else res.render("register", { loggedIn: 0 });
});
app.get("/login", function (req, res) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stal   e=0, post-check=0, pre-check=0"
  );
  if (req.isAuthenticated()) {
    res.render("index", { loggedIn: 1 });
  } else res.render("login", { loggedIn: 0 });
});

app.get("/addexpense", function (req, res) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stal   e=0, post-check=0, pre-check=0"
  );
  if (req.isAuthenticated()) {
    console.log(req.session.passport.user);
    res.render("addNewExpense");
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
          console.log("b", d == req.body.date, d, req.body.date);
          if (d == req.body.date) {
            element.content.push({
              description: req.body.description,
              amount: req.body.amount,
            });
            flag = 1;
          }
        });
        console.log(existing);
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
        console.log("a", existing);
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
    console.log("a", req.body.username, req.body.password);
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/");
          });
        }
      }
    );
  }
});

app.post("/login", passport.authenticate("local"), function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        console.log(user);
        res.redirect("index");
      });
    }
  });
});

app.get("/getexpense", function (req, res) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stal   e=0, post-check=0, pre-check=0"
  );
  if (req.isAuthenticated()) {
    Expense.findOne({ email: req.session.passport.user })
      .exec()
      .then((docs) => {
        console.log(docs.expense);
        res.render("viewExpense", { expense: docs.expense });
      });
  } else {
    res.redirect("/login");
  }
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
