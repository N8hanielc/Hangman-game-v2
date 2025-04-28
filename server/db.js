const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql_db',   // matches docker-compose service name
  user: 'root',
  password: 'password',
  database: 'hangman_db',
});

connection.connect(err => {
  if (err) {
    console.error('Database connection error: ', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
