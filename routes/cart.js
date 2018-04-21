var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', (req, res, next) => {
    if(req.session.user){
        res.render('cart',{title:'cart',loggedin:true,user:req.session.user})
    }
    else{
        res.redirect('/');
    }
});

module.exports=router;