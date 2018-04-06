var express = require('express');
var router = express.Router();
var db=require('../db');
/* GET home page. */
router.get('/customer', function(req, res, next) {
    res.render('signup_cust', { title: 'Customer SignUp' });
});
router.post('/customer', function(req, res, next) {
    console.log(req.body);
    var create_table="CREATE TABLE IF NOT EXISTS customers (custid INT NOT NULL AUTO_INCREMENT,cname VARCHAR(20) NOT NULL,dob DATE NOT NULL,PRIMARY KEY (custid))";
    db.query(create_table,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });
    var dob=req.body.dob;
    var insert="INSERT INTO customers (cname,dob) values ('" + req.body.cname+ "','1997-09-09')";
    db.query(insert,function(err,result){
        if(err) console.log(err);
        else console.log(result);
    });
    res.redirect('/');
});
router.get('/seller', function(req, res, next) {
    res.render('signup_seller', { title: 'Seller SignUp' });
});
module.exports = router;
