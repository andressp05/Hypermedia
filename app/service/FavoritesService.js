'use strict';

let Codes = require('../utils/Codes.js');
let utils = require('../utils/writer.js');
let Data = require('../utils/Data');

let sqlDb = Data.database;

exports.our_favoritesDbSetup = async function (database) {
  sqlDb = database;
  console.log("Checking if our_favorites table exists");
  const exists = await sqlDb.schema.hasTable(Data.Tables.favorite);
  if (!exists) {
    console.log("our_favorites doesn't esist so we need to create it");
  }
  else {
    console.log("our_favorites table exists");
  }
};

/**
 * Favorites books available in the inventory
 * List of favorites books available in the inventory
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 4 and cannot exceed 500. (optional)
 * returns List
 **/

exports.favoritesGET = async function(offset = 0, limit = 6) {
  try {
    const data = await sqlDb
      .select(
        Data.Tables.book + '.*',
        sqlDb.raw(`array_agg(${Data.Tables.author}.name ORDER BY ${Data.Tables.author}.author_id) AS a_name`),
        sqlDb.raw(`array_agg(${Data.Tables.author}.surname ORDER BY  ${Data.Tables.author}.author_id) a_surname`))
      .from(Data.Tables.favorite)
      .leftJoin(Data.Tables.book, Data.Tables.favorite + '.ISBN', Data.Tables.book + '.ISBN')
      .leftJoin(Data.Tables.written_by, Data.Tables.book + '.ISBN', Data.Tables.written_by + '.ISBN')
      .leftJoin(Data.Tables.author, Data.Tables.written_by + '.author_id', Data.Tables.author + '.author_id')
      .groupBy(`${Data.Tables.book}.ISBN`).limit(limit).offset(offset);
    return new Promise((resolve, reject) => {
      resolve(mapBook(data));
    });
  } catch (e) {
    return new Promise((res, rej) => {
      console.log("el error va aca");
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
let mapBook = function(data) {
  // return book.then(data => {
  return data.map(e => {
    e.price = {
      value: e.price,
      currency: "EUR"
    };
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
