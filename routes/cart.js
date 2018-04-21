var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', (req, res, next) => {
    if(req.session.user.type==='customer'){
        var addeditems="select * from addedto a natural join shoppingcart s where s.cartid is not null and s.orderid is null and s.custid='"+req.session.user.custid+"'";
        db.query(addeditems,(err,result)=>{
            if(err) console.log(err);
            else{
                console.log(result);
                var arritem=[];
                result.forEach(item=>{
                    var items = "select * from items where itemid='" + item.itemid + "'";
                    db.query(items,function(err,result){
                        if(err) console.log(err);
                        else{
                            console.log(result);
                            arritem.push(result[0]);
                        }
                    });
                });
                setTimeout(()=>{ res.render('cart',{title:'cart',loggedin:true,user:req.session.user,items:arritem}) },500);
            }
        });
       
    }
    else{
        res.redirect('/');
    }
});

router.post('/order',(req,res,next)=>{
    res.redirect('/');
});

module.exports=router;