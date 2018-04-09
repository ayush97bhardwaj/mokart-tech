var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession=require('express-session');

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

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use((req,res,next)=>{
  var additem="CREATE TABLE IF NOT EXISTS items (itemid VARCHAR(40) NOT NULL UNIQUE,iname VARCHAR(20) NOT NULL,price FLOAT NOT NULL,description VARCHAR(100) NOT NULL,shipcost FLOAT NOT NULL,sellerid VARCHAR(40) NOT NULL,iquantity INT NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (sellerid) REFERENCES sellers(sellerid))"; 
  db.query(additem,(err,result)=>{
    if(err) console.log(err);
    else console.log(result);
  })
  var electronics="CREATE TABLE IF NOT EXISTS electronics (itemid VARCHAR(40) NOT NULL UNIQUE,warrenty VARCHAR(20) NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (itemid) REFERENCES items(itemid))";
  db.query(electronics,(err,result)=>{
    if(err) console.log(err);
    else console.log(result);
  });
  var fashion="CREATE TABLE IF NOT EXISTS fashion (itemid VARCHAR(40) NOT NULL UNIQUE,size VARCHAR(20) NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (itemid) REFERENCES items(itemid))";
  db.query(fashion,(err,result)=>{
    if(err) console.log(err);
    else console.log(result);
  })
  var sports="CREATE TABLE IF NOT EXISTS sports (itemid VARCHAR(40) NOT NULL UNIQUE,size VARCHAR(20) NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (itemid) REFERENCES items(itemid))";
  db.query(sports,(err,result)=>{
    if(err) console.log(err);
    else console.log(result);
  })
  var books="CREATE TABLE IF NOT EXISTS books (itemid VARCHAR(40) NOT NULL UNIQUE,author VARCHAR(20) NOT NULL,publisher VARCHAR(20) NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (itemid) REFERENCES items(itemid))";
  db.query(books,(err,result)=>{
    if(err) console.log(err);
    else console.log(result);
  })
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/signup',signup);
app.use('/signin',signin);
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
