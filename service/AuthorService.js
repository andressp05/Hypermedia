'use strict';

let Codes = require('../utils/Codes');
var utils = require('../utils/writer');
let Data = require('../utils/Data');

let sqlDb = Data.database;

exports.authorsDbSetup = function (database) {
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
exports.authorsGET = async function (offset = 0, limit = 20) {
  // let authors = sqlDb.select().table('authors').limit(limit).offset(offset);
  try {
    const data = await sqlDb.select(`${Data.Tables.author}.*`,
      sqlDb.raw(`array_agg(${Data.Tables.book}."ISBN") AS "ISBN"`),
      sqlDb.raw(`array_agg(${Data.Tables.book}.name) book_name`))
      .from(Data.Tables.author)
      .leftJoin(Data.Tables.written_by, `${Data.Tables.author}.author_id`, `${Data.Tables.written_by}.author_id`)
      .leftJoin(Data.Tables.book, `${Data.Tables.written_by}.ISBN`, `${Data.Tables.book}.ISBN`)
      .groupBy(`${Data.Tables.author}.author_id`).limit(limit).offset(offset);
    return new Promise((resolve, reject) => {
      resolve(data);
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
exports.getAuthorById = async function (authorId) {
  try{
    const data = await sqlDb.select(`${Data.Tables.author}.*`,
      sqlDb.raw(`array_agg(${Data.Tables.book}."ISBN") AS "ISBN"`),
      sqlDb.raw(`array_agg(${Data.Tables.book}.name) book_name`))
      .from(Data.Tables.author)
      .leftJoin(Data.Tables.written_by, `${Data.Tables.author}.author_id`, `${Data.Tables.written_by}.author_id`)
      .leftJoin(Data.Tables.book, `${Data.Tables.written_by}.ISBN`, `${Data.Tables.book}.ISBN`)
      .groupBy(`${Data.Tables.author}.author_id`).where(`${Data.Tables.author}.author_id`, authorId);

    return new Promise(function (resolve, reject) {
      if (Object.keys(data).length > 0) {
        resolve(data);
      } else {
        reject(utils.respondWithCode(Codes.NOT_FOUND, '{"message": "Author not found"}'));
      }
    });
  } catch (e) {
    return new Promise((res, rej) => {
      console.log(e);
      rej(utils.respondWithCode(Codes.GENERIC_ERROR, `{"message": "${e}"`))
    })
  }
}