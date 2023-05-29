const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const app = express();
const methodOverride = require("method-override");
const connectFlash = require("connect-flash");
require('dotenv').config();
const User = require("./database/user.js");
const homePageController = require("./controllers/homePage.js");
const getRegisterController = require("./controllers/getRegister.js");
const getLoginController = require("./controllers/getLogin.js");
const getAddExpenseController = require("./controllers/getAddExpense.js");
const postAddExpenseController = require("./controllers/postAddExpense.js");
const postRegisterController = require("./controllers/postRegister.js");
const deleteAccountController = require("./controllers/deleteAccount.js");
const deleteDocumentController = require("./controllers/deleteDocument.js");
const deleteRowItemController = require("./controllers/deleteRowItem.js");
const logoutController = require("./controllers/logout.js");
const postLoginController = require("./controllers/postLogin.js");
const showExpenseController = require("./controllers/getShowExpense.js");

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
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());

mongoose.connect(process.env.API_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", homePageController);

app.get("/index", homePageController);

app.get("/register", getRegisterController);

app.get("/login", getLoginController);

app.get("/addexpense", getAddExpenseController);
app.post("/addexpense", postAddExpenseController);

app.post("/register", postRegisterController);

app.post("/login", postLoginController);

app.get("/getexpense", showExpenseController);

app.delete("/row/:id/:date", deleteRowItemController);
app.delete("/delete/account", deleteAccountController);
app.delete("/delete/date/:date", deleteDocumentController);

app.get("/logout", logoutController);

app.listen(process.env.PORT || 3000);
