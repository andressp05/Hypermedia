const sqlDbFactory = require("knex");

let { booksDbSetup } = require("../service/BookService.js");
let { usersDbSetup } = require("../service/UserService.js");


const TABLES = {
  book: 'Books',
  author: 'author',
  written_by: 'written_by',
  users: 'users'
}

let sqlDb = sqlDbFactory({
  client: 'pg',
  debug: true,
  connection: process.env.DATABASE_URL || 'postgres://itdrqfolhcqnuu:4ecc64ca1bbdd8a7703f8a799aaade99b9cf1be3dd7a4d8972293cc1e8104fcc@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d9cbl2ahoq35f1?ssl=true',
  ssl: true
});

/**
 * Setup the database checking if every table
 */
function setupDataLayer(){
  return new Promise((res, rej) => {
    var allExists = true;
    for (const table in TABLES) {
      if (TABLES.hasOwnProperty(table)) {
        sqlDb.schema.hasTable(TABLES[table]).then(exists => {
          console.log(`Checking if ${TABLES[table]} table exists`);
          if (exists) {
            console.log(`${TABLES[table]} table exists`);
          } else {
            console.log(`${TABLES[table]} doesn't exist`);
            allExists = false;
            // reject();
          }
        });
      }
    }
    // Promise.all()
    if (allExists) {
      res(allExists);
    } else {
      rej(allExists);
    }
    // resolve();
  });
}

// function setupDataLayer() {
//   console.log("Setting up data layer");
//   booksDbSetup(sqlDb);
//   usersDbSetup(sqlDb);
//   return new Promise(function(resolve, reject) {
//     resolve();
//   });
// }

module.exports = { database: sqlDb, setupDataLayer };
