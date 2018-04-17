var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession=require('express-session');
var session=require('client-sessions');
var hbs=require('hbs');
require('dotenv').load();

var index = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
var signin=require('./routes/signin');
var additem=require('./routes/add');

var db=require('./db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookieName: 'session',
  secret: 'its my first session generation',
  duration: 30*60*1000,
  activeDuration: 30*60*1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));
// app.use(expressSession({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true
// }));

function isloggedin(req,res,next){
  if(req.session && req.session.user)
  {
    res.redirect('/')
  }
  else
    next();
};

app.use('/', index);
app.use('/users', users);
app.use('/signup',isloggedin,signup);
app.use('/signin',isloggedin,signin);
app.use('/seller',additem);
app.get('/logout',(req,res,next)=>{
  req.session.destroy(function(err){
    if(err) console.log(err);
  });
  res.redirect('/signin');
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
