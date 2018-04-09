var express=require('express');
var router=express.Router();
var db=require('../db');

router.get('/add',(req,res,next)=>{
    res.render('additem',{});
});

router.post('/additem',(req,res,next)=>{
    var countquery="select count(*) from items as i where i.sellerid='"+req.session.sellerid+"'";
    db.query(countquery,(err,result)=>{
        if(err) console.log(err);
        else{
            // console.log(result[0]['count(*)']);
            var count=result[0]['count(*)'];
            var itemid=req.session.sellerid+""+count;
            var additem="INSERT INTO items (itemid,iname,price,description,shipcost,sellerid,iquantity) values ('"+itemid+"','"+req.body.iname+"','"+req.body.price+"','"+req.body.desc+"','"+req.body.shipcost+"','"+req.session.sellerid+"','"+req.body.qty+"')";
            db.query(additem,(err,result)=>{
                if(err) console.log(err);
                // else console.log(result);
            });
        }
    });
    console.log(req.session.sellerid);
    res.redirect('/');
});

module.exports=router;