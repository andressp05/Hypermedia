'use strict';

let Codes = require('../utils/Codes.js');
let utils = require('../utils/writer.js');
let Data = require('../utils/Data');

let sqlDb = Data.database;

exports.booksDbSetup = async function (database) {
  sqlDb = database;
  console.log("Checking if books table exists");
  const exists = await sqlDb.schema.hasTable(Data.Tables.book);
  if (!exists) {
    console.log("It doesn't so we create it");
  }
  else {
    console.log("Books table exists");
  }
};

/**
 * Books available in the inventory
 * List of books available in the inventory
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.booksGET = async function (offset = 0, limit = 20) {
  try{
    const data = await sqlDb
      .select(
        Data.Tables.book + '.*',
        sqlDb.raw(`array_agg(${Data.Tables.author}.name ORDER BY ${Data.Tables.author}.author_id) AS a_name`),
        sqlDb.raw(`array_agg(${Data.Tables.author}.surname ORDER BY  ${Data.Tables.author}.author_id) a_surname`))
      .from(Data.Tables.book)
      .leftJoin(Data.Tables.written_by, Data.Tables.book + '.ISBN', Data.Tables.written_by + '.ISBN')
      .leftJoin(Data.Tables.author, Data.Tables.written_by + '.author_id', Data.Tables.author + '.author_id')
      .groupBy(`${Data.Tables.book}.ISBN`).limit(limit).offset(offset);
    return new Promise((resolve, reject) => {
      resolve(mapBook(data));
    });
  } catch (e) {
    return new Promise((res, rej) => {
      console.log(e);
      rej(utils.respondWithCode(Codes.GENERIC_ERROR, `{"message": "${e}"`))
    })
  }
}


/**
 * Find book by ID
 * Returns a book
 *
 * bookId Long ID of book to return
 * returns Book
 **/
exports.getBookById = async function (bookId) {
  try{
    const data = await sqlDb
      .select(
        Data.Tables.book + '.*',
        sqlDb.raw(`array_agg(${Data.Tables.author}.name ORDER BY ${Data.Tables.author}.author_id) AS a_name`),
        sqlDb.raw(`array_agg(${Data.Tables.author}.surname ORDER BY  ${Data.Tables.author}.author_id) a_surname`))
      .from(Data.Tables.book)
      .leftJoin(Data.Tables.written_by, Data.Tables.book + '.ISBN', Data.Tables.written_by + '.ISBN')
      .leftJoin(Data.Tables.author, Data.Tables.written_by + '.author_id', Data.Tables.author + '.author_id')
      .groupBy(`${Data.Tables.book}.ISBN`).where(`${Data.Tables.book}.ISBN`, bookId);
    return new Promise(function (resolve, reject) {
      if (Object.keys(data).length > 0) {
        console.log(data);
        resolve(mapBook(data)[0]);
      } else {
        reject(utils.respondWithCode(Codes.NOT_FOUND, '{"message": "Book not found"}'));
      }
    });
  } catch (e) {
    return new Promise((res, rej) => {
      console.log(e);
      rej(utils.respondWithCode(Codes.GENERIC_ERROR, `{"message": "${e}"`))
    })
  }
}

/**
 * Map a book mapping the database call result into the Swagger defined product Book.
 * @param  {[type]} book the result of the call to the database
 * @return {[type]}      the Swagger spec compliant Book product.
 */
let mapBook = function (data) {
  // return book.then(data => {
  return data.map(e => {
    e.price = { value: e.price, currency: "EUR" };
    e.author = [];
    for (let i = 0; i < e.a_name.length; i++) {
      e.author.push(e.a_name[i] + ' ' + e.a_surname[i]);
    }
    delete e.a_name;
    delete e.a_surname; 
    return e;
  });
  // });
}
