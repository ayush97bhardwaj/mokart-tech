var express = require('express');
var router = express.Router();
var db=require('../db');
/* GET home page. */
router.get('/', function(req, res, next) {
  // db.query('select * from items',function(err,result){
  //   if(err) console.log(err);
  //   else{
  //     console.log(result);
  //     res.render('index', { title: 'Home',items:result});
  //   }
  // });
  res.render('index', { title: 'Home'});
});
module.exports = router;
