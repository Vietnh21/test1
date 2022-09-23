"user strict";

var mysql = require("mysql");

//local mysql db connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs_mysql",
});
// connect to database
connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;

// CREATE TABLE users (
//   id int(11) NOT NULL,
//   name varchar(200) NOT NULL,
//   age int(1) NOT NULL,
//   address varchar(200) NOT NULL
//  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

//  INSERT INTO users (id, name, age, address) VALUES
//  (1, 'Find bugs', 1, 'address'),
//  (2, 'Review code', 1, 'address'),
//  (3, 'Fix bugs', 1, 'address'),
//  (4, 'Refactor Code', 1, 'address'),
//  (5, 'Push to prod', 1, 'address');
