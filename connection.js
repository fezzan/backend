const mysql = require("mysql");
var mysqlConnection = mysql.createConnection({
    host : "160.119.254.32",
    user : "root",
    password : "malik200",
    database : process.env.DBNAME || "xosports",
    multipleStatements : true,
});

mysqlConnection.connect((err)=>{
    if(!err){
        console.log("Connected!");
    }
    else{
        console.log("Connection Failed");
    }
});

module.exports = mysqlConnection;