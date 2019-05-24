'use strict';

let Codes = require('../utils/Codes.js');
let utils = require('../utils/writer.js');
let Data = require('../utils/Data');

let sqlDb = Data.database;

exports.booksDbSetup = function(database) {
  sqlDb = database;
  console.log("Checking if books table exists");
  return sqlDb.schema.hasTable(Data.Tables.book).then(exists => {
    if (!exists) {
      console.log("It doesn't so we create it");
    } else {
      console.log("Books table exists");
    }
  });
};

/**
 * Books available in the inventory
 * List of books available in the inventory
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.booksGET = function(offset=0, limit=20) {
  // return new Promise((resolve, reject) => {
  //   let books = sqlDb.select().table(Data.Tables.book).limit(limit).offset(offset);
  //   resolve(books.then(data => mapBook(data)));
  // });

  return sqlDb.select().table(Data.Tables.book).limit(limit).offset(offset)
  .then(data => {
    return new Promise((resolve, reject) => {
      resolve(mapBook(data));
    })
  })
}


/**
 * Find book by ID
 * Returns a book
 *
 * bookId Long ID of book to return
 * returns Book
 **/
exports.getBookById = function(bookId) {
  return new Promise(function(resolve, reject) {
    let book = sqlDb(Data.Tables.book).where('ISBN', bookId);
    book.then(data => {
      if (Object.keys(data).length > 0) {
        resolve(data.map(e => {
          e.price = {value: e.price, currency: "EUR"};
          return e;
        }));
      } else {
        reject(utils.respondWithCode(Codes.NOT_FOUND, '{"message": "Book not found"}'));
      }
    });
    // if (Object.keys(book).length > 0) {
    //   resolve(mapBook(book));
    // } else {
    //   throw new Error("Book not found");
    // }

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
 * @param  {[type]} book the result of the call to the database
 * @return {[type]}      the Swagger spec compliant Book product.
 */
let mapBook = function(data) {
  // return book.then(data => {
    return data.map(e => {
      e.price = {value: e.price, currency: "EUR"};
      return e;
    });
  // });
}


let getBookAuthor = function(bookId) {
  
}