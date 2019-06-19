'use strict';

let Codes = require('../utils/Codes.js');
let utils = require('../utils/writer.js');
let Data = require('../utils/Data');

let sqlDb = Data.database;

exports.reviewsDbSetup = async function (database) {
  sqlDb = database;
  console.log("Checking if reviews table exists");
  const exists = await sqlDb.schema.hasTable(Data.Tables.reviews);
  if (!exists) {
    console.log("reviews doesn't esist so we need to create it");
  }
  else {
    console.log("reviews table exists");
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

exports.getBookReviews = async function(isbn) {
  try {
    const data = await sqlDb
      .select(
        `${Data.Tables.reviews}.ISBN`,
        `${Data.Tables.reviews}.review`,
        `${Data.Tables.user}.name`,
        `${Data.Tables.user}.surname`,
        `${Data.Tables.user}.email`)
      .from(Data.Tables.reviews)
      .where('ISBN', isbn)
      .leftJoin(Data.Tables.user, `${Data.Tables.reviews}.client_id`, `${Data.Tables.user}.id`)
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data.length > 0){
        resolve(mapReview(data));
      } else {
        reject(utils.respondWithCode(Codes.NOT_FOUND, `{"message": "Book not found with ISBN ${isbn}"}`));
      }

    });
  } catch (e) {
    return new Promise((res, rej) => {
      console.log("el error va aca");
      console.log(e);
      rej(utils.respondWithCode(Codes.GENERIC_ERROR, `{"message": "${e}"}`))
    })
  }
}


let mapReview = function(data) {
  // return book.then(data => {
  return data.map(e => {
    e.name = e.name + " " + e.surname;
    delete e.surname;
    return e;
  });
  // });
}