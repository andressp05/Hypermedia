'use strict';

let Codes = require('../utils/Codes');
let utils = require('../utils/writer');
let Data = require('../utils/Data');

let sqlDb = Data.database;

exports.cartDbSetup = async function (database) {
  sqlDb = database;
  console.log("Checking if our_favorites table exists");
  const exists = await sqlDb.schema.hasTable(Data.Tables.cart);
  if (!exists) {
    console.log("Cart table doesn't so we create it");
  }
  else {
    console.log("cart table exists");
  }
};

exports.addItem = function(user_id, isbn, quantity) {
  
    // const data = await sqlDb.insert({client_id: user_id}).into(Data.Tables.cart)
    //   .whereNotExists(sqlDb.select('*').from(Data.Tables.cart).where(`${Data.Tables.cart}.client_id`, user_id)).returning('id');
    return new Promise((resolve, reject) => {
      sqlDb.select('*').from(Data.Tables.cart).where(`${Data.Tables.cart}.client_id`, user_id)
      .then(async function(rows){
        if(rows.length === 0){
          let newId = await sqlDb.insert({client_id: user_id}).into(Data.Tables.cart).returning('id');
          return newId[0];
        } else {
          return rows[0].id;
        }
      }).then( function(id){
        // sqlDb.insert({cart_id: id}).into(Data.Tables.cart_detail)
        let query = `SELECT quantity FROM ${Data.Tables.cart_detail} WHERE cart_id = ${id} AND "ISBN" = ${isbn}`;
        return sqlDb.raw(`INSERT INTO ${Data.Tables.cart_detail} (cart_id, "ISBN", quantity) VALUES (${id}, ${isbn}, ${quantity}) ON CONFLICT (cart_id, "ISBN") DO UPDATE SET "ISBN" = ${isbn}, quantity = (${query}) + ${quantity} RETURNING *;`)
        
      }).then(obj => {
        delete obj.rows[0].cart_id;
        console.log(obj.rows[0]);
        resolve(obj.rows[0]);
      })
      .catch(err => {
        console.log(err);
        reject(utils.respondWithCode(Codes.GENERIC_ERROR, `{"message": "${err}"`))
      })

    });

}


exports.removeItem = async function(user_id, isbn) {
  try {
    let subquery = sqlDb.select('id').from(Data.Tables.cart).where('client_id', user_id);
    const data = await sqlDb(Data.Tables.cart_detail).where('ISBN', isbn).andWhere('cart_id', subquery).del();
    console.log(data);
    return new Promise((resolve, reject) => {
      if(data > 0){
        sqlDb.select('ISBN', quantity).from(Data.Tables.cart_detail).where('cart_id', subquery)
        .then(items => {
          resolve(items);
        });
        // resolve(data);
      } else {
        console.log('removeItem - ERROR 404 - no book found in the cart with isbn ' + isbn);
        reject(utils.respondWithCode(Codes.NOT_FOUND, `{"message": "book ${isbn} not in the shopping cart"`));
      }
    });
  } catch (e) {
    return new Promise((res, rej) => {
      console.log(e);
      rej(utils.respondWithCode(Codes.GENERIC_ERROR, `{"message": "${e}"`));
    })
  }
}


exports.getUserCart = async function(user_id) {
  try {
    const data = await sqlDb.select(`${Data.Tables.cart_detail}.ISBN`, `${Data.Tables.cart_detail}.quantity`).from(Data.Tables.cart).where('client_id', user_id)
      .join(Data.Tables.cart_detail, `${Data.Tables.cart}.id`, `${Data.Tables.cart_detail}.cart_id`);
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

