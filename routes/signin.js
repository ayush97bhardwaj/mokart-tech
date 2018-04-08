var express = require('express');
var router = express.Router();
var db=require('../db');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('signin', { title: 'signin' });
});

router.post('/customer',(req,res,next)=>{
    var pass="SELECT * FROM customers as c WHERE c.custid='"+req.body.email+"'";
    db.query(pass,(err,result)=>{
        if(err) console.log(err);
        else if(result.length==0){
            res.render('signin',{err:'email not registered'});
        }
        else{
            // console.log(result[0].password);
            if(result[0].password != req.body.password){
                res.render('signin',{err:'wrong password',email:req.body.email});
            }
            else res.redirect('/signin');
        }
    })
    // res.redirect('/signin');
});

module.exports = router;
