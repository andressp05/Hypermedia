const sqlDbFactory = require("knex");

let { booksDbSetup } = require("../service/BookService.js");
let { usersDbSetup } = require("../service/UserService.js");
let { authorsDbSetup } = require("../service/AuthorService.js");
let { our_favoritesDbSetup } = require("../service/FavoritesService.js");
let { eventsDbSetup } = require("../service/EventService.js");
let { cartDbSetup } = require("../service/CartService");


exports.Tables = {
  book: 'books',
  author: 'authors',
  written_by: 'written_by',
  user: 'clients',
  favorite: 'our_favorites',
  evento: 'events',
  cart: 'cart',
  cart_detail: 'cart_detail'
}

let sqlDb = sqlDbFactory({
  client: 'pg',
  debug: true,
  connection: process.env.DATABASE_URL || 'postgres://zcewloawnvphjh:a4974b184a6780cc4324d21998ba4b9421ae7f5b6c18c0cf73901edc7e97b12a@ec2-176-34-183-20.eu-west-1.compute.amazonaws.com:5432/dcd9njsp145phm?ssl=true',
  ssl: true
});

/**
 * Setup the database checking if every table
 */
// function setupDataLayer(){
//   return new Promise((resolve, reject) => {
//     var allExists = true;
//     for (const table in TABLES) {
//       if (TABLES.hasOwnProperty(table)) {
//         sqlDb.schema.hasTable(TABLES[table]).then(exists => {
//           console.log(`Checking if ${TABLES[table]} table exists`);
//           if (exists) {
//             console.log(`${TABLES[table]} table exists`);
//           } else {
//             console.log(`${TABLES[table]} doesn't exist`);
//             allExists = false;
//             // reject();
//           }
//         });
//       }
//     }
//     resolve();
//     // Promise.all()
//     // if (allExists) {
//     //   res(allExists);
//     // } else {
//     //   rej(allExists);
//     // }
//     // resolve();
//   });
// }

function setupDataLayer() {
  return new Promise(function(resolve, reject) {
    console.log("Setting up data layer");
    booksDbSetup(sqlDb);
    usersDbSetup(sqlDb);
    authorsDbSetup(sqlDb);
    our_favoritesDbSetup(sqlDb);
    eventsDbSetup(sqlDb);
    cartDbSetup(sqlDb);
    resolve();
  });
}

module.exports = { database: sqlDb, setupDataLayer};
