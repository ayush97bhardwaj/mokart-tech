var express = require('express');
var router = express.Router();
var db = require('../db');
/* GET home page. */
router.get('/', function (req, res, next) {
    // db.query('select * from items',function(err,result){
    //   if(err) console.log(err);
    //   else{
    //     console.log(result);
    //     res.render('index', { title: 'Home',items:result});
    //   }
    // });

  var itemsexists=`SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = 'dbms_proj' 
      AND table_name = 'items'`;
  
  db.query(itemsexists,(err,result)=>{
    if(err) console.log(err);
    else{
      // console.log(result[0]);
      if(result[0]['count(*)']!=0){
        console.log('items are present');
        var countquery="select * from items";
        db.query(countquery,(err,result)=>{
          if(err) console.log(err);
          else{
            if(req.session.user)
              res.render('index', { title: 'Home',items:result,loggedin:true,user:req.session.user});
            else
              res.render('index', { title: 'Home',items:result,loggedin:false});
          }
        });
      }
      else{
        res.render('index', { title: 'Home',items:0,loggedin:false});
      }
    }
  });    

});
module.exports = router;
