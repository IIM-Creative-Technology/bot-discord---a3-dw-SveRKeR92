const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
});

connection.connect((err) => {
      if (err) {
            console.log(err)
      } else {
            console.log('connection successfull')
      }
});

function sqlQuery(query, params) {
      return new Promise((resolve, reject) => {
            connection.query(
                  query, params,
                  (error, results) => {
                        if (error) return reject(error);
                        return resolve(results);
                  });
      });
}

module.exports = {
      sqlQuery
}