const mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DBNAME,
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: \n " + err.message);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
