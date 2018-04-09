var express = require('express');
var router = express.Router();
var db=require('../db');
/* GET home page. */
router.get('/customer', function(req, res, next) {
    res.render('signup_cust', { title: 'Customer SignUp' });
});
router.post('/customer', function(req, res, next) {
    console.log(req.body);
    // var re = /^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
    var create_table_customers="CREATE TABLE IF NOT EXISTS customers (custid VARCHAR(40) NOT NULL UNIQUE,cname VARCHAR(20) NOT NULL,password VARCHAR(100) NOT NULL,dob DATE NOT NULL,PRIMARY KEY (custid))";
    // console.log(create_table_customers);
    db.query(create_table_customers,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });

    var create_table_custphone="CREATE TABLE IF NOT EXISTS custphone (custid VARCHAR(40) NOT NULL,cphone VARCHAR(20) NOT NULL,PRIMARY KEY (custid,cphone),FOREIGN KEY (custid) REFERENCES customers(custid))";
    // console.log(create_table_cphone);
    db.query(create_table_custphone,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });

    var create_table_state="CREATE TABLE IF NOT EXISTS state (city VARCHAR(20) NOT NULL UNIQUE,state VARCHAR(20) NOT NULL,PRIMARY KEY (city))";
    // console.log(create_table_state);
    db.query(create_table_state,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });

    var create_table_city="CREATE TABLE IF NOT EXISTS city (pincode VARCHAR(6) NOT NULL UNIQUE,city VARCHAR(20) NOT NULL,PRIMARY KEY (pincode),FOREIGN KEY (city) REFERENCES state(city))";
    // console.log(create_table_city);
    db.query(create_table_city,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });

    var create_table_caddress="CREATE TABLE IF NOT EXISTS caddress (custid VARCHAR(40) NOT NULL,houseno VARCHAR(50) NOT NULL,streetno VARCHAR(50) NOT NULL,pincode VARCHAR(6) NOT NULL,PRIMARY KEY (custid,houseno,streetno,pincode),FOREIGN KEY (pincode) REFERENCES city(pincode),FOREIGN KEY (custid) REFERENCES customers(custid))";
    // console.log(create_table_address);
    db.query(create_table_caddress,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });

    // var trigger="CREATE TRIGGER check_custid BEFORE INSERT ON customers FOR EACH ROW BEGIN  END;";
    // db.query(trigger,function(err,result){
    //     if(err) console.log(err);
    //     else console.log(result);
    // });
    // var dob=req.body.dob;

    var insert_cust="INSERT INTO customers (custid,cname,password,dob) values ('" + req.body.email+ "','"+req.body.cname+"','"+req.body.password+"','"+req.body.dob+"')";
    // console.log(insert_cust);
    db.query(insert_cust,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });

    req.body.address.forEach(addr=>{
        var insert_state="INSERT INTO state (city,state) values ('" + addr.city+ "','"+addr.state+"')";
        // console.log(insert_state);
        db.query(insert_state,function(err,result){
            if(err) console.log(err);
            else console.log(result);
        });
        
        var insert_city="INSERT INTO city (pincode,city) values ('" + addr.pincode+ "','"+addr.city+"')";
        console.log(insert_state);
        db.query(insert_city,function(err,result){
            if(err) console.log(err);
            else console.log(result);
        });

        var insert_caddress="INSERT INTO caddress (custid,houseno,streetno,pincode) values ('" + req.body.email+ "','"+addr.houseno+"','"+addr.streetno+"','"+addr.pincode+"')";
        // console.log(insert_caddress);
        db.query(insert_caddress,function(err,result){
            if(err) console.log(err);
            else console.log(result);
        });
    });

    req.body.phone.forEach(phone => {
        var insert_custphone="INSERT INTO custphone (custid,cphone) values ('" + req.body.email+ "','"+phone+"')";
        // console.log(insert_state);
        db.query(insert_custphone,function(err,result){
            if(err) console.log(err);
            else console.log(result);
        });            
    });
    // INSERT INTO custphone (custid,cphone) values ('a@a','1234');
    res.redirect('/');
});
router.get('/seller', function(req, res, next) {
    res.render('signup_seller', { title: 'Seller SignUp' });
});
router.post('/seller',function(req,res,next){
    var create_table_sellers="CREATE TABLE IF NOT EXISTS sellers (sellerid VARCHAR(40) NOT NULL UNIQUE,sname VARCHAR(20) NOT NULL,password VARCHAR(100) NOT NULL,dob DATE NOT NULL,address VARCHAR(100) NOT NULL,PRIMARY KEY (sellerid))";
    db.query(create_table_sellers,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });

    var create_table_sellerphone="CREATE TABLE IF NOT EXISTS sellerphone (sellerid VARCHAR(40) NOT NULL,sphone VARCHAR(20) NOT NULL,PRIMARY KEY (sellerid,sphone),FOREIGN KEY (sellerid) REFERENCES sellers(sellerid))";
    db.query(create_table_sellerphone,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });

    var additem="CREATE TABLE IF NOT EXISTS items (itemid VARCHAR(40) NOT NULL UNIQUE,iname VARCHAR(20) NOT NULL,price FLOAT NOT NULL,description VARCHAR(100) NOT NULL,shipcost FLOAT NOT NULL,sellerid VARCHAR(40) NOT NULL,iquantity INT NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (sellerid) REFERENCES sellers(sellerid))"; 
    db.query(additem,(err,result)=>{
        if(err) console.log(err);
        // else console.log(result);
    });
    var electronics="CREATE TABLE IF NOT EXISTS electronics (itemid VARCHAR(40) NOT NULL UNIQUE,warrenty VARCHAR(20) NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (itemid) REFERENCES items(itemid))";
    db.query(electronics,(err,result)=>{
        if(err) console.log(err);
        // else console.log(result);
    });
    var fashion="CREATE TABLE IF NOT EXISTS fashion (itemid VARCHAR(40) NOT NULL UNIQUE,size VARCHAR(20) NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (itemid) REFERENCES items(itemid))";
    db.query(fashion,(err,result)=>{
        if(err) console.log(err);
        // else console.log(result);
    });
    var sports="CREATE TABLE IF NOT EXISTS sports (itemid VARCHAR(40) NOT NULL UNIQUE,size VARCHAR(20) NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (itemid) REFERENCES items(itemid))";
    db.query(sports,(err,result)=>{
        if(err) console.log(err);
        // else console.log(result);
    });
    var books="CREATE TABLE IF NOT EXISTS books (itemid VARCHAR(40) NOT NULL UNIQUE,author VARCHAR(20) NOT NULL,publisher VARCHAR(20) NOT NULL,PRIMARY KEY (itemid),FOREIGN KEY (itemid) REFERENCES items(itemid))";
    db.query(books,(err,result)=>{
        if(err) console.log(err);
        // else console.log(result);
    });
    //...................insert data of seller...............................

    var insert_seller="INSERT INTO sellers (sellerid,sname,password,dob,address) values ('" + req.body.email+ "','"+req.body.sname+"','"+req.body.password+"','"+req.body.dob+"','"+req.body.address+"')";
    db.query(insert_seller,function(err,result){
        if(err) console.log(err.sqlMessage);
        else console.log(result);
    });

    req.body.phone.forEach(phone => {
        var insert_sellerphone="INSERT INTO sellerphone (sellerid,sphone) values ('" + req.body.email+ "','"+phone+"')";
        db.query(insert_sellerphone,function(err,result){
            if(err) console.log(err);
            else console.log(result);
        });
    });

    res.redirect('/');
});
module.exports = router;
