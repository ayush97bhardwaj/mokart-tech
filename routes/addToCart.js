var express = require('express');
var router = express.Router();
var db = require('../db');
var multer=require('multer');
/* GET home page. */
router.get('/:id', function (req, res, next) {

    var countquery = "select * from items";
    db.query(countquery, (err, result) => {
        if (err) console.log(err);
        else {
            if (req.session.user)
                res.render('index', {title: 'Home', items: result, loggedin: true, user: req.session.user});
            else
                res.render('index', {title: 'Home', loggedin: false});
        }
    });
});


router.post('/additem',(req,res,next)=>{
    // console.log('image uploa hogi');
    // console.log(req.file.path);
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

            var additem="INSERT INTO items (itemid,iname,price,description,shipcost,sellerid,iquantity) values ('"+itemid+"','"+req.body.iname+"','"+req.body.price+"','"+req.body.desc+"','"+req.body.shipcost+"','"+req.session.user.sellerid+"','"+req.body.qty+"')";

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
