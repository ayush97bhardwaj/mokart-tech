var express=require('express');
var multer=require('multer');
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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('destinaion');
        console.log(req.session.user.sellerid);
      cb(null, './public/images/' + req.session.user.sellerid);
    },
    filename: function (req, file, cb) {
        console.log('filename');
        cb(null,'' + Date.now());
    }
})
var upload=multer({storage: storage});

router.post('/additem',upload.single('pic'),(req,res,next)=>{
    console.log('image hogi add');
    // console.log(req.file);
    // console.log(req.file.filename);
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
            if(req.file && req.file.path)
                var additem="INSERT INTO items (itemid,iname,price,description,shipcost,sellerid,iquantity,dateofadd,type,url,image) values ('"+itemid+"','"+req.body.iname+"','"+req.body.price+"','"+req.body.desc+"','"+req.body.shipcost+"','"+req.session.user.sellerid+"','"+req.body.qty+"','"+d+"','"+req.body.itemCategory+"','"+req.file.destination+"','"+req.file.filename+"')";
            else
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

router.get('/orders', (req, res, next) => {

    if(req.session.user && req.session.user.type === 'seller')
    {
        var pending='select * from (items i natural join addedto a) natural join shoppingcart s where a.itemstatus="pending" and i.sellerid="'+req.session.user.sellerid+'" order by s.orderdate desc';
        db.query(pending,(err,result)=>{
            if(err) console.log(err);
            else{
                console.log(result);
                res.render('receivedorders',{title:'orders',loggedin:true,user:req.session.user,items:result});
            }
        });
        
    }
    else{
        res.redirect('/');
    }

});

router.get('/allorders', (req, res, next) => {

    if(req.session.user && req.session.user.type === 'seller')
    {
        var pending='select * from (items i natural join addedto a) natural join shoppingcart s where i.sellerid="'+req.session.user.sellerid+'" order by s.orderdate desc';
        db.query(pending,(err,result)=>{
            if(err) console.log(err);
            else{
                console.log(result);
                res.render('allsellerorders',{title:'orders',loggedin:true,user:req.session.user,items:result});
            }
        });
        
    }
    else{
        res.redirect('/');
    }

});

router.get('/order/:itemid/:cartid',(req,res,next)=>{
    var change='update addedto set itemstatus ="ready" where cartid="'+req.params.cartid+'" and itemid="'+req.params.itemid+'"';
    db.query(change,(err,result)=>{
        if(err) console.log(err);
        else{
            console.log(result);
            var dispatch='select count(*) from addedto where cartid="'+req.params.cartid+'"';
            db.query(dispatch,(err,result2)=>{
                if(err) console.log(err);
                else{
                    console.log(result2);
                    var ready='select count(*) from addedto where cartid="'+req.params.cartid+'" and itemstatus="ready"';
                    db.query(ready,(err,result3)=>{
                        if(err) console.log(err);
                        else{
                            console.log(result3);
                            if(result2[0]['count(*)']==result3[0]['count(*)'])
                            {
                                var updstatus='update shoppingcart set orderstatus="ready to dispatch" where cartid="'+req.params.cartid+'"';
                                db.query(updstatus,(err,result4)=>{
                                    if(err) console.log(err);
                                    else{
                                        console.log(result4);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });
    res.redirect('/seller/orders');
});
module.exports=router;