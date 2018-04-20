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
                            else console.log(result);
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