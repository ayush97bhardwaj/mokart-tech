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
      console.log('seller exists');
      if(result[0]['count(*)']!=0){
        console.log('items are present');
        if(req.session.user){
          if(req.session.user.type=='seller')
          {
            var latest_items='select * from items where sellerid="'+req.session.user.sellerid+'" order by dateofadd desc limit 4';
            db.query(latest_items,function(err,result){
              if(err) console.log(err);
              else{
                console.log(result);
                //................to be done after customer views added.........................................
                // var latest_items='select itemid,count(*) from views v natural join items i where sellerid="'+req.session.user.sellerid+'" group by itemid';
                
                res.render('index', { title: 'Home',items:result,loggedin:true,user:req.session.user});
              }
            });
          }
          else{
            res.render('index', { title: 'Home',items:0,loggedin:true,user:req.session.user});
          }
        }
        else{
          res.render('index', { title: 'Home',items:0,loggedin:false});
        }
        // if(req.session.user)
        //   res.render('index', { title: 'Home',items:result,loggedin:true,user:req.session.user});
        // else
        //   res.render('index', { title: 'Home',items:result,loggedin:false});
      
      }
      else{
        res.render('index', { title: 'Home',items:0,loggedin:false});
      }
    }
  });    

});
module.exports = router;
