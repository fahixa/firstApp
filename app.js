var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

var expressLayout = require('express-ejs-layouts');

const database = require('./config/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var moviesRouter = require('./routes/movies');

var app = express();

// config passport
require('./config/passport')(passport);

// express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// view engine setup
app.use(expressLayout);
app.set('view engine', 'ejs');

// connection mongoDB
database.connection.on("error", console.error.bind(console, "MongoDB Connection Error:"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// global variable
app.use((req, res, next) => {
  res.locals.error = req.flash('errors');
  next();
})

app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/movies', moviesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
