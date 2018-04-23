var mysql = require('mysql');
require('dotenv').load;
var settings = {
    host     : 'localhost',
    user     : 'root',
    password : process.env.sqlpass
};
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(settings);
        //console.log(db);
        db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
                db.query('create database if not exists dbms_proj',(err,result)=>{
                    if(err) console.log(err);
                    else{
                        console.log(result);
                        db.query('use dbms_proj',(err,result)=>{
                            if(err) console.log(err);
                            else {
                                console.log(result);
        //...................//.............................cust signup tables...................................
                                var create_table_customers=`CREATE TABLE IF NOT EXISTS
                                    customers (
                                        custid VARCHAR(100) NOT NULL UNIQUE,
                                        cname VARCHAR(100) NOT NULL,
                                        password VARCHAR(100) NOT NULL,
                                        dob DATE NOT NULL,
                                        age INT,
                                        PRIMARY KEY (custid)
                                    )`;
                                // console.log(create_table_customers);
                                db.query(create_table_customers,function(err,result){
                                    if(err) console.log(err);
                                    else console.log(result);
                                });

                                        var age_trigger=`create trigger check_name before insert on customers for each row
                                        begin
                                        declare age int;
                                        set age=datediff(now(),new.dob)/365.25;
                                        if age < 18 then
                                        signal sqlstate '45000'
                                        SET message_text='customer age less than 18';
                                        else
                                        set new.age=age;
                                        END IF;
                                        END;`;

                                        db.query(age_trigger,function(err,result){
                                            if(err) console.log(err);
                                            else{
                                                console.log('trigger set hai');
                                                console.log(result);
                                            }
                                        });

                                var create_table_custphone=`CREATE TABLE IF NOT EXISTS 
                                    custphone (
                                        custid VARCHAR(100) NOT NULL,
                                        cphone VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (custid,cphone),
                                        FOREIGN KEY (custid) REFERENCES customers(custid)
                                    )`;
                                // console.log(create_table_cphone);
                                db.query(create_table_custphone,function(err,result){
                                    if(err) console.log(err);
                                    else console.log(result);
                                });

                                var create_table_state=`CREATE TABLE IF NOT EXISTS 
                                    state (
                                        city VARCHAR(100) NOT NULL UNIQUE,
                                        state VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (city)
                                    )`;
                                // console.log(create_table_state);
                                db.query(create_table_state,function(err,result){
                                    if(err) console.log(err);
                                    else console.log(result);
                                });

                                var create_table_city=`CREATE TABLE IF NOT EXISTS 
                                    city (
                                        pincode VARCHAR(100) NOT NULL UNIQUE,
                                        city VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (pincode),
                                        FOREIGN KEY (city) REFERENCES state(city)
                                    )`;
                                // console.log(create_table_city);
                                db.query(create_table_city,function(err,result){
                                    if(err) console.log(err);
                                    else console.log(result);
                                });

                                var create_table_caddress=`CREATE TABLE IF NOT EXISTS 
                                    caddress (
                                        custid VARCHAR(100) NOT NULL,
                                        houseno VARCHAR(100) NOT NULL,
                                        streetno VARCHAR(100) NOT NULL,
                                        pincode VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (custid,houseno,streetno,pincode),
                                        FOREIGN KEY (pincode) REFERENCES city(pincode),
                                        FOREIGN KEY (custid) REFERENCES customers(custid)
                                    )`;
                                // console.log(create_table_address);
                                db.query(create_table_caddress,function(err,result){
                                    if(err) console.log(err);
                                    else console.log(result);
                                });


    //.............................//........................seller signup tables...................................

                                var create_table_sellers=`CREATE TABLE IF NOT EXISTS 
                                    sellers (
                                        sellerid VARCHAR(100) NOT NULL UNIQUE,
                                        sname VARCHAR(100) NOT NULL,
                                        password VARCHAR(100) NOT NULL,
                                        dob DATE NOT NULL,
                                        age INT,
                                        address VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (sellerid))`;
                                db.query(create_table_sellers,function(err,result){
                                    if(err) console.log(err);
                                    else console.log(result);
                                });

                                var age_trigger=`create trigger check_age_seller before insert on sellers for each row
                                        begin
                                        declare age int;
                                        set age=datediff(now(),new.dob)/365.25;
                                        if age < 18 then
                                        signal sqlstate '45000'
                                        SET message_text='sellers age less than 18';
                                        else
                                        set new.age=age;
                                        END IF;
                                        END;`;

                                    db.query(age_trigger,function(err,result){
                                        if(err) console.log(err);
                                        else{
                                            console.log('trigger set hai');
                                            console.log(result);
                                        }
                                    });

                                var create_table_sellerphone=`CREATE TABLE IF NOT EXISTS 
                                    sellerphone (
                                        sellerid VARCHAR(100) NOT NULL,
                                        sphone VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (sellerid,sphone),
                                        FOREIGN KEY (sellerid) REFERENCES sellers(sellerid))`;
                                db.query(create_table_sellerphone,function(err,result){
                                    if(err) console.log(err);
                                    else console.log(result);
                                });

                                var additem=`CREATE TABLE IF NOT EXISTS 
                                    items (
                                        itemid VARCHAR(100) NOT NULL UNIQUE,
                                        iname VARCHAR(100) NOT NULL,
                                        price FLOAT NOT NULL,
                                        description VARCHAR(100) NOT NULL,
                                        shipcost FLOAT NOT NULL,
                                        sellerid VARCHAR(100) NOT NULL,
                                        iquantity INT NOT NULL,
                                        dateofadd DATETIME NOT NULL,
                                        type VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (itemid),
                                        FOREIGN KEY (sellerid) REFERENCES sellers(sellerid))`; 
                                db.query(additem,(err,result)=>{
                                    if(err) console.log(err);
                                    else console.log(result);
                                });
                                var electronics=`CREATE TABLE IF NOT EXISTS 
                                    electronics (
                                        itemid VARCHAR(100) NOT NULL UNIQUE,
                                        warrenty VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (itemid),
                                        FOREIGN KEY (itemid) REFERENCES items(itemid))`;
                                db.query(electronics,(err,result)=>{
                                    if(err) console.log(err);
                                    else console.log(result);
                                });
                                var fashion=`CREATE TABLE IF NOT EXISTS 
                                    fashion (itemid VARCHAR(100) NOT NULL UNIQUE,
                                        size VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (itemid),
                                        FOREIGN KEY (itemid) REFERENCES items(itemid))`;
                                db.query(fashion,(err,result)=>{
                                    if(err) console.log(err);
                                    else console.log(result);
                                });
                                var sports=`CREATE TABLE IF NOT EXISTS
                                    sports (
                                        itemid VARCHAR(100) NOT NULL UNIQUE,
                                        size VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (itemid),
                                        FOREIGN KEY (itemid) REFERENCES items(itemid))`;
                                db.query(sports,(err,result)=>{
                                    if(err) console.log(err);
                                    else console.log(result);
                                });
                                var books=`CREATE TABLE IF NOT EXISTS 
                                    books (
                                        itemid VARCHAR(100) NOT NULL UNIQUE,
                                        author VARCHAR(100) NOT NULL,
                                        publisher VARCHAR(100) NOT NULL,
                                        PRIMARY KEY (itemid),
                                        FOREIGN KEY (itemid) REFERENCES items(itemid))`;
                                db.query(books,(err,result)=>{
                                    if(err) console.log(err);
                                    else console.log(result);
                                });

        //..................//...............................signin tables......................................
                                
                                var shoppingcart=`CREATE TABLE IF NOT EXISTS 
                                    shoppingcart (
                                        cartid VARCHAR(100) NOT NULL UNIQUE,
                                        custid VARCHAR(100) NOT NULL,
                                        orderid VARCHAR(100),
                                        paymode VARCHAR(100),
                                        orderdate DATETIME,
                                        orderstatus VARCHAR(100),
                                        PRIMARY KEY (cartid),
                                        FOREIGN KEY (custid) REFERENCES customers(custid)
                                    )`; 
                                db.query(shoppingcart,(err,result)=>{
                                    if(err) console.log(err);
                                    // else console.log(result);
                                });
                                var addedto=`CREATE TABLE IF NOT EXISTS 
                                    addedto (
                                        itemid VARCHAR(100) NOT NULL,
                                        addedqty INT NOT NULL,
                                        cartid VARCHAR(100) NOT NULL,
                                        itemstatus VARCHAR(100),
                                        PRIMARY KEY(itemid,cartid),
                                        FOREIGN KEY(itemid) REFERENCES items(itemid),
                                        FOREIGN KEY(cartid) REFERENCES shoppingcart(cartid)
                                    )`;
                                db.query(addedto,(err,result)=>{
                                    if(err) console.log(err);
                                    // else console.log(result);
                                });
                                var contains=`CREATE TABLE IF NOT EXISTS 
                                    contains (
                                        orderid VARCHAR(100) NOT NULL,
                                        itemid VARCHAR(100) NOT NULL,
                                        orderedqty INT NOT NULL,
                                        dateofship DATE NOT NULL,
                                        dateofdelivery DATE NOT NULL,
                                        PRIMARY KEY(orderid,itemid),
                                        FOREIGN KEY(itemid) REFERENCES items(itemid)
                                    )`;
                                db.query(contains,(err,result)=>{
                                    if(err) console.log(err);
                                    // else console.log(result);
                                });
                                var views=`CREATE TABLE IF NOT EXISTS 
                                    views (
                                        custid VARCHAR(100) NOT NULL,
                                        itemid VARCHAR(100) NOT NULL, 
                                        PRIMARY KEY(custid,itemid),
                                        FOREIGN KEY(itemid) REFERENCES items(itemid),
                                        FOREIGN KEY(custid) REFERENCES customers(custid)
                                    )`;
                                db.query(views,(err,result)=>{
                                    if(err) console.log(err);
                                    // else console.log(result);
                                });
                            }
                        });
                    }
                });

            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();