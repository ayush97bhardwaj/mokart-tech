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

                res.render('viewItems',{title:'result[0].iname',result:result[0],loggedin:true,user:req.session.user});
            }
            else{
                res.render('viewItems',{title:'result.iname',result:result,loggedin:false});
            }
        }
    })
});

router.post('/addtocart/:id',(req,res,next)=>{
    var cart='select *from shoppingcart where cartid is not null and orderid is null and custid="'+req.session.user.custid+'"';
    db.query(cart,(err,result)=>{
        if(err) console.log(err);
        else{
            console.log(result);
            var additem='insert into addedto (itemid,addedqty,cartid) values ("'+req.params.id+'","'+req.body.qty+'","'+result[0].cartid+'")';
            db.query(additem,(err,result)=>{
                if(err) {
                    console.log(err.sqlMessage);
                    var cerr=''+err.sqlMessage;
                    cerr=cerr.search('Duplicate entry');

                    //.........................item search with params id.....................
                    var item = "select * from items as i where i.itemid='" + req.params.id + "'";
                    db.query(item,function(err,result){
                        if(err) console.log(err);
                        else{
                            console.log(result);
                            if(cerr!=-1){
                                var errmsg='<div style="color:red;font-size:12px;padding:10px;">the item is already added to the cart</div>';
                                res.render('viewItems',{title:'view item',loggedin:true,user:req.session.user,result:result[0],err:errmsg});
                            }
                            else{
                                res.render('viewItems',{title:'view item',loggedin:true,user:req.session.user,result:result[0],err:err.sqlMessage});
                            }
                        }
                    });
                    
                }
                else{
                    console.log(result);
                    res.redirect('/cart');
                }
            });
        }
    });
});

module.exports = router;