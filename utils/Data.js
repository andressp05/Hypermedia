const sqlDbFactory = require("knex");

let { booksDbSetup } = require("../service/BookService.js");
let { usersDbSetup } = require("../service/UserService.js");

// let sqlDb = sqlDbFactory({
//   client: "pg",
//   // connection: process.env.DATABASE_URL,
//   connection: {
//     host: 'ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432',
//     user: 'itdrqfolhcqnuu',
//     password: '4ecc64ca1bbdd8a7703f8a799aaade99b9cf1be3dd7a4d8972293cc1e8104fcc',
//     database: 'd9cbl2ahoq35f1',
//     ssl: true,
//     debug: true
//   }
//   // ssl: true,
//   // debug: true
// });

let sqlDb = sqlDbFactory({
  client: 'pg',
  debug: true,
  connection: process.env.DATABASE_URL || 'postgres://itdrqfolhcqnuu:4ecc64ca1bbdd8a7703f8a799aaade99b9cf1be3dd7a4d8972293cc1e8104fcc@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d9cbl2ahoq35f1?ssl=true',
  ssl: true
});

function setupDataLayer() {
  console.log("Setting up data layer");
  booksDbSetup(sqlDb);
  usersDbSetup(sqlDb);
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

module.exports = { database: sqlDb, setupDataLayer };
