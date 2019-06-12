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
      sqlDb.raw(`array_agg(${Data.Tables.book}."ISBN" ORDER BY ${Data.Tables.book}."ISBN") AS book_isbn`),
      sqlDb.raw(`array_agg(${Data.Tables.book}.name ORDER BY ${Data.Tables.book}."ISBN") book_name`))
      .from(Data.Tables.author)
      .leftJoin(Data.Tables.written_by, `${Data.Tables.author}.author_id`, `${Data.Tables.written_by}.author_id`)
      .leftJoin(Data.Tables.book, `${Data.Tables.written_by}.ISBN`, `${Data.Tables.book}.ISBN`)
      .groupBy(`${Data.Tables.author}.author_id`).limit(limit).offset(offset);
    return new Promise((resolve, reject) => {
      resolve(mapAuthor(data));
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
      sqlDb.raw(`array_agg(${Data.Tables.book}."ISBN" ORDER BY ${Data.Tables.book}."ISBN") AS book_isbn`),
      sqlDb.raw(`array_agg(${Data.Tables.book}.name ORDER BY ${Data.Tables.book}."ISBN") book_name`))
      .from(Data.Tables.author)
      .leftJoin(Data.Tables.written_by, `${Data.Tables.author}.author_id`, `${Data.Tables.written_by}.author_id`)
      .leftJoin(Data.Tables.book, `${Data.Tables.written_by}.ISBN`, `${Data.Tables.book}.ISBN`)
      .groupBy(`${Data.Tables.author}.author_id`).where(`${Data.Tables.author}.author_id`, authorId);

    return new Promise(function (resolve, reject) {
      if (Object.keys(data).length > 0) {
        console.log('Author:');
        console.log(data);
        resolve(mapAuthor(data)[0]);
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

function mapAuthor(data){
  return data.map(e => {
    e.books = [];
    for (let i = 0; i < e.book_isbn.length; i++) {
      let obj = {
        ISBN: e.book_isbn[i],
        name: e.book_name[i]
      };
      e.books.push(obj);
    }
    delete e.book_isbn;
    delete e.book_name;
    return e;
  });
}