'use strict';

let Codes = require('../utils/Codes.js');
var utils = require('../utils/writer.js');

let sqlDb;

exports.authorsDbSetup = function(database) {
  sqlDb = database;
  console.log("Checking if authors table exists");
  return database.schema.hasTable("authors").then(exists => {
    if (!exists) {
      console.log("It doesn't so we create it");
    } else {
      console.log("authors table exists");
    }
  });
};

/**
 * Authors available in the inventory
 * List of authors available in the inventory
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.authorsGET = function(offset=0, limit=500) {
  let authors = sqlDb.select().table('authors').limit(limit).offset(offset);
  return mapAuthor(authors);
}

/**
 * Find book by ID
 * Returns a book
 *
 * bookId Long ID of book to return
 * returns Book
 **/
exports.getAuthorById = function(authorId) {
  return new Promise(function(resolve, reject) {
    let author = sqlDb('authors').where('author_id', authorId);
    author.then(data => {
      console.log(Object.keys(data).length);
      if (Object.keys(data).length > 0) {
        resolve(data.map(e => {
          e.price = {value: e.price, currency: "EUR"};
          return e;
        }));
      } else {
        reject(utils.respondWithCode(Codes.NOT_FOUND, '{message: Book not found}'));
      }
    });

  });


//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = {
//   "id" : 0,
//   "title" : "Il deserto dei tartari",
//   "author" : "Dino Buzzati",
//   "price" : {
//     "value" : 10,
//     "currency" : "EUR"
//   },
//   "status" : "available"
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
}

/**
 * Map a book mapping the database call result into the Swagger defined product Book.
 * @param  {[type]} author the result of the call to the database
 * @return {[type]}      the Swagger spec compliant Book product.
 */
let mapAuthor = function(author) {
  return author.then(data => {
    return data.map(e => {
      e.price = {value: e.price, currency: "EUR"};
      return e;
    });
  });
}
