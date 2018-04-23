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
            var latest_items='select * from items where sellerid="'+req.session.user.sellerid+'" order by dateofadd desc limit 100';
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
            var view,pend,sport,book,electronic,fash;
            var viewed='select * from items i natural join views v where v.custid="'+req.session.user.custid+'" limit 8';
            db.query(viewed,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                view=result1;
              }
            });
            var sports='select i.itemid,i.iname,i.price,count(*) from views v right join items i on i.itemid=v.itemid where i.type="sports" group by i.itemid order by count(*) desc limit 8';
            db.query(sports,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                sport=result1;
              }
            });
            var books='select i.itemid,i.iname,i.price,count(*) from views v right join items i on i.itemid=v.itemid where i.type="books" group by i.itemid order by count(*) desc limit 8';
            db.query(books,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                book=result1;
              }
            });
            var electronics='select i.itemid,i.iname,i.price,count(*) from views v right join items i on i.itemid=v.itemid where i.type="electronics" group by i.itemid order by count(*) desc limit 8';
            db.query(electronics,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                electronic=result1;
              }
            });
            var fashion='select i.itemid,i.iname,i.price,count(*) from views v right join items i on i.itemid=v.itemid where i.type="fashion" group by i.itemid order by count(*) desc limit 8';
            db.query(fashion,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                fash=result1;
              }
            });
            var pending='select * from (items i natural join addedto a) natural join shoppingcart s where s.orderstatus="pending" and s.custid="'+req.session.user.custid+'"';
            db.query(pending,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                pend=result1;
              }
            });
            setTimeout(()=> { res.render('index', { title: 'Home',sports:sport,books:book,electronics:electronic,fashion:fash,viewed:view,pending:pend,loggedin:true,user:req.session.user}) },1000);
          }
        }
        else{

          var sport,book,electronic,fash;
          var sports='select i.itemid,i.iname,i.price,count(*) from views v right join items i on i.itemid=v.itemid where i.type="sports" group by i.itemid order by count(*) desc limit 8';
            db.query(sports,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                sport=result1;
              }
            });
            var books='select i.itemid,i.iname,i.price,count(*) from views v right join items i on i.itemid=v.itemid where i.type="books" group by i.itemid order by count(*) desc limit 8';
            db.query(books,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                book=result1;
              }
            });
            var electronics='select i.itemid,i.iname,i.price,count(*) from views v right join items i on i.itemid=v.itemid where i.type="electronics" group by i.itemid order by count(*) desc limit 8';
            db.query(electronics,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                electronic=result1;
              }
            });
            var fashion='select i.itemid,i.iname,i.price,count(*) from views v right join items i on i.itemid=v.itemid where i.type="fashion" group by i.itemid order by count(*) desc limit 8';
            db.query(fashion,(err,result1)=>{
              if(err) console.log(err);
              else{
                console.log(result1);
                fash=result1;
              }
            });
            setTimeout(()=> { res.render('index', { title: 'Home',sports:sport,books:book,electronics:electronic,fashion:fash,loggedin:false}) },1000);
          // res.render('index', { title: 'Home',items:0,loggedin:false});
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
