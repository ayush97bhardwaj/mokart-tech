var express = require('express');
var router = express.Router();
var db=require('../db');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(1);
    if(req.session){
        console.log(12);
        if(req.session.custid){
            console.log(123);
            res.render('signin', { title: 'signin' , user:req.session.custid});
        }
        else if(req.session.sellerid){
            console.log(1234);
            res.render('signin', { title: 'signin' , user:req.session.sellerid});
        }
        else{
            console.log(12345);
            console.log(req.session);
            res.render('signin', { title: 'signin' });
        }
    }
    else{
        console.log(123456);
        res.render('signin', { title: 'signin' });
    }
});

router.post('/customer',(req,res,next)=>{
    var pass="SELECT * FROM customers as c WHERE c.custid='"+req.body.email+"'";
    db.query(pass,(err,result)=>{
        if(err) console.log(err);
        else if(result.length==0){
            res.render('signin',{err:'email not registered as customer'});
        }
        else{
            // console.log(result[0].password);
            if(result[0].password != req.body.password){
                res.render('signin',{err:'wrong password for registered customer',email:req.body.email});
            }
            else {
                req.session.custid=req.body.email;
                var shoppingcart="CREATE TABLE IF NOT EXISTS shoppingcart (cartid VARCHAR(40) NOT NULL UNIQUE,custid VARCHAR(40) NOT NULL,orderid VARCHAR(40),paymode VARCHAR(20),orderdate DATE,orderstatus VARCHAR(20),PRIMARY KEY (cartid),FOREIGN KEY (custid) REFERENCES customers(custid))"; 
                db.query(shoppingcart,(err,result)=>{
                    if(err) console.log(err);
                    // else console.log(result);
                });
                var addedto="CREATE TABLE IF NOT EXISTS addedto (itemid VARCHAR(40) NOT NULL,addedqty INT NOT NULL,cartid VARCHAR(40) NOT NULL,PRIMARY KEY(itemid,cartid),FOREIGN KEY(itemid) REFERENCES items(itemid),FOREIGN KEY(cartid) REFERENCES shoppingcart(cartid))";
                db.query(addedto,(err,result)=>{
                    if(err) console.log(err);
                    // else console.log(result);
                });
                var contains="CREATE TABLE IF NOT EXISTS contains (orderid VARCHAR(40) NOT NULL,itemid VARCHAR(40) NOT NULL,orderedqty INT NOT NULL,dateofship DATE NOT NULL,dateofdelivery DATE NOT NULL,PRIMARY KEY(orderid,itemid),FOREIGN KEY(itemid) REFERENCES items(itemid))";
                db.query(contains,(err,result)=>{
                    if(err) console.log(err);
                    // else console.log(result);
                });
                var views="CREATE TABLE IF NOT EXISTS views (custid VARCHAR(40) NOT NULL,itemid VARCHAR(40) NOT NULL, PRIMARY KEY(custid,itemid),FOREIGN KEY(itemid) REFERENCES items(itemid),FOREIGN KEY(custid) REFERENCES customers(custid))";
                db.query(views,(err,result)=>{
                    if(err) console.log(err);
                    // else console.log(result);
                });
                res.redirect('/signin');
            }
        }
    })
    // res.redirect('/signin');
});

router.post('/seller',(req,res,next)=>{
    var pass="SELECT * FROM sellers as s WHERE s.sellerid='"+req.body.email+"'";
    db.query(pass,(err,result)=>{
        if(err) console.log(err);
        else if(result.length==0){
            res.render('signin',{err:'email not registered for seller'});
        }
        else{
            // console.log(result[0].password);
            if(result[0].password != req.body.password){
                res.render('signin',{err:'wrong password for registered seller',email:req.body.email});
            }
            else {
                req.session.sellerid=req.body.email;
                res.redirect('/signin');
            }
        }
    })
    // res.redirect('/signin');
});
module.exports = router;
