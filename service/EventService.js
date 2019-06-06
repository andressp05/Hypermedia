'use strict';

let Codes = require('../utils/Codes');
var utils = require('../utils/writer');
let Data = require('../utils/Data');

let sqlDb = Data.database;

exports.eventsDbSetup = function (database) {
  sqlDb = database;
  console.log("Checking if events table exists");
  return database.schema.hasTable("events").then(exists => {
    if (!exists) {
      console.log("Events doesn't so we create it");
    } else {
      console.log("events table exists");
    }
  });
};

/**
 * Events available in the inventory
 * List of events available in the inventory
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.eventsGET = async function (offset = 0, limit = 20) {
  // let events = sqlDb.select().table('events').limit(limit).offset(offset);
  try {
    const data = await sqlDb.select(`${Data.Tables.evento}.*`)
      .from(Data.Tables.evento).limit(limit).offset(offset);
    return new Promise((resolve, reject) => {
      resolve(mapEvent(data));
    });
  } catch (e) {
    return new Promise((res, rej) => {
      console.log(e);
      rej(utils.respondWithCode(Codes.GENERIC_ERROR, `{"message": "${e}"`))
    })
  }
}

/**
 * Find an event by ID
 * Returns a event
 *
 * eventId Long ID of event to return
 * returns Event
 **/
exports.getEventById = async function (authorId) {
  try{
    const data = await sqlDb.select(`${Data.Tables.evento}.*`)
      .from(Data.Tables.evento).where(`${Data.Tables.evento}.event_id`, eventId);

    return new Promise(function (resolve, reject) {
      if (Object.keys(data).length > 0) {
        resolve(mapEvent(data));
      } else {
        reject(utils.respondWithCode(Codes.NOT_FOUND, '{"message": "Event not found"}'));
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
 * @param  {[type]} evento the result of the call to the database
 * @return {[type]}      the Swagger spec compliant Book product.
 */
let mapEvent = function (data) {
  // return book.then(data => {
  return data.map(e => {
    e.date_start = e.date_start.getDate().toString().padStart(2,"0")
    + "/" + e.date_start.getMonth().toString().padStart(2,"0")
    + "/" + e.date_start.getFullYear().toString();
    e.date_end = e.date_end.getDate().toString().padStart(2,"0")
    + "/" + e.date_end.getMonth().toString().padStart(2,"0")
    + "/" + e.date_end.getFullYear().toString();;

    return e;
  });
  // });
}
