var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', (req, res, next) => {
    if(req.session.user){
        if(req.session.user.type==='customer'){
            var addeditems="select * from (items i natural join addedto a) natural join shoppingcart s where s.cartid is not null and s.orderid is null and s.custid='"+req.session.user.custid+"'";
            db.query(addeditems,(err,result)=>{
                if(err) console.log(err);
                else{
                    console.log(result);
                    // var arritem=[];
                    // result.forEach(item=>{
                    //     var items = "select * from items where itemid='" + item.itemid + "'";
                    //     db.query(items,function(err,result){
                    //         if(err) console.log(err);
                    //         else{
                    //             console.log(result);
                    //             arritem.push(result[0]);
                    //         }
                    //     });
                    // });
                    setTimeout(()=>{ res.render('cart',{title:'cart',loggedin:true,user:req.session.user,items:result}) },500);
                }
            });
        
        }
        else res.redirect('/signin');
    }
    else{
        res.redirect('/');
    }
});
router.get('/orders',(req,res,next)=>{
    if(req.session.user && req.session.user.type=='customer'){
        var ord='select * from (addedto a natural join items i) natural join shoppingcart s where s.custid="'+req.session.user.custid+'" order by s.orderdate desc';
        db.query(ord,(err,result)=>{
            if(err) console.log(err);
            else{
                console.log(result);
                res.render('vieworders',{title:'orders',loggedin:true,user:req.session.user,order:result});
            }
        });
        // res.render('vieworders',{title:'orders',loggedin:true,user:req.session.user,order:result});
    }
    else{
        res.redirect('/');
    }
});

router.post('/order',(req,res,next)=>{
    var d = new Date();
    let month=d.getMonth()+1;
    d=''+d.getFullYear()+'-'+month+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    
    var upd_order="update shoppingcart set orderid=cartid,orderstatus='pending',orderdate='"+d+"',paymode='"+req.body.modeofpay+"' where cartid is not null and orderid is null and custid='"+req.session.user.custid+"'";
    
    db.query(upd_order,(err,result)=>{
        if(err) console.log(err);
        else{
            console.log(result);
            var cartcount='select count(*) from shoppingcart where custid="'+req.session.user.custid+'"';
            db.query(cartcount,(err,result2)=>{
                if(err) console.log(err);
                else{
                    console.log(result2);
                    var newcart=''+req.session.user.custid+result2[0]['count(*)'];
                    var cart='insert into shoppingcart (cartid,custid) values ("'+newcart+'","'+req.session.user.custid+'")';
                    db.query(cart,(err,result3)=>{
                        if(err) console.log(err);
                        else console.log(result3);
                    });
                }
            });

            ////..................................................
            var cartid="select * from shoppingcart where custid='"+req.session.user.custid+"' order by orderdate desc limit 1";
            db.query(cartid,(err,result2)=>{
                if(err) console.log(err);
                else{
                    console.log(result2[0]);
                    var items='select * from addedto where cartid="'+result2[0].cartid+'"';
                    db.query(items,(err,result3)=>{
                        result3.forEach(item=>{
                            var qtydec='update items set iquantity=iquantity-'+item.addedqty+' where itemid="'+item.itemid+'"';
                            db.query(qtydec,(err,result4)=>{
                                if(err) console.log(err);
                                else console.log(result4);
                            });
                        });
                    });
                }
            });
        }
    });
    res.redirect('/');
});

router.get('/remove/:itemid/:cartid',(req,res,next)=>{
    console.log(req.params.cartid);
    var remove='delete from addedto where cartid="'+req.params.cartid+'" and itemid="'+req.params.itemid+'"';
    db.query(remove,(err,result)=>{
        if(err) console.log(err);
        else{
            console.log(result);
            res.redirect('/cart');
        }
    });
});
module.exports=router;