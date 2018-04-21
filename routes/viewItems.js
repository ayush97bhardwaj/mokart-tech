var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/:id', (req, res, next) => {

    var item = "select * from items as i where i.itemid='" + req.params.id + "'";
    db.query(item,function(err,result){
        if(err) console.log(err);
        else{
            console.log(result);
            if(req.session.user){
                if(req.session.user.type==='customer'){
                    var views='insert into views (custid,itemid) values ("'+req.session.user.custid+'","'+req.params.id+'")'
                    db.query(views,(err,result)=>{
                        if(err) console.log(err);
                        else console.log(result);
                    });
                }
                res.render('viewItems',{title:result[0].iname,result:result[0],loggedin:true,user:req.session.user});
            }
            else{
                res.render('viewItems',{title:result.iname,result:result,loggedin:false});
            }
        }
    })
});

router.post('/addtocart/:id',(req,res,next)=>{
    
    res.redirect('/cart');
});

module.exports = router;