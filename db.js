var mysql = require('mysql');
require('dotenv').load;
var settings = {
    host     : 'localhost',
    user     : 'root',
    password : process.env.sqlpass,
    database : 'dbms_proj'
};
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(settings);

        db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();