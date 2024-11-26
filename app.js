var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var mongoose = require("mongoose");
require("./model/usersmodel");
require("./model/products");
require("./model/studentsmodel");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productRouter = require("./routes/product");
var studentRouter = require("./routes/student");
var uploadRouter = require("./routes/upload");
var emailRouter = require("./routes/email");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/student", studentRouter);
app.use("/upload", uploadRouter);
app.use("/email", emailRouter);

// connect
mongoose
  .connect(
    "mongodb+srv://hnthao2705:wMJOmtF7T1klOU2V@cluster0.wy9n1.mongodb.net/md19302"
  )
  .then(() => console.log("DB Connected"))
  .catch(() => this.console.log("DB error"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
