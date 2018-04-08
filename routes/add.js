var express=require('express');
var router=express.Router();
var db=require('../db');

router.get('/',(req,res,next)=>{
    res.render('additem',{});
});

router.post('/additem',(req,res,next)=>{
    res.redirect('/');
});

module.exports=router;