var express=require('express');
var router=express.Router();
var db=require('../db');

router.get('/add',(req,res,next)=>{
    if(req.session.user){
        if(req.session.user.type=='seller')
            res.render('additem',{title: 'Add Item',loggedin:true,user:req.session.user});
        else res.redirect('/');
    }
    else res.redirect('/');
});

router.post('/additem',(req,res,next)=>{
    var countquery="select count(*) from items as i where i.sellerid='"+req.session.user.sellerid+"'";
    db.query(countquery,(err,result)=>{
        if(err) console.log(err);
        else{
            // console.log(result[0]['count(*)']);
            var count=result[0]['count(*)'];
            var itemid=req.session.user.sellerid+""+count;
            if(req.body.itemCategory == "books"){
                var addcategory = "INSERT INTO " + req.body.itemCategory + " values ('"+itemid+"','"+req.body.author+"','"+req.body.publisher+"') ";
            }
            else if(req.body.itemCategory == "electronics"){
                var addcategory = "INSERT INTO " + req.body.itemCategory + " values ('"+itemid+"','"+req.body.warranty+"') ";
            }
            else if(req.body.itemCategory == "fashion"){
                var addcategory = "INSERT INTO " + req.body.itemCategory + " values ('"+itemid+"','"+req.body.size+"') ";
            }
            else if(req.body.itemCategory == "sports"){
                var addcategory = "INSERT INTO " + req.body.itemCategory + " values ('"+itemid+"','"+req.body.size+"') ";
            }
            var d = new Date();
            let month=d.getMonth()+1;
            d=''+d.getFullYear()+'-'+month+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
            // month = '' + (d.getMonth() + 1),
            // day = '' + d.getDate(),
            // year = d.getFullYear();
        
            // if (month.length < 2) month = '0' + month;
            // if (day.length < 2) day = '0' + day;
        
            // d= [year, month, day].join('-');
            console.log(d);

            var additem="INSERT INTO items (itemid,iname,price,description,shipcost,sellerid,iquantity,dateofadd,type) values ('"+itemid+"','"+req.body.iname+"','"+req.body.price+"','"+req.body.desc+"','"+req.body.shipcost+"','"+req.session.user.sellerid+"','"+req.body.qty+"','"+d+"','"+req.body.itemCategory+"')";

            db.query(additem,(err,result)=>{
                if(err) console.log(err);
               // else console.log(result);
            });

            db.query(addcategory,(err,result)=>{
                if(err) console.log(err);
                else console.log(result);
            });

        }
    });
    res.redirect('/');
});

module.exports=router;