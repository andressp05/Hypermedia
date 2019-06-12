'use strict';

let bcrypt = require('bcrypt');
let shortid = require('shortid');

let Codes = require('../utils/Codes');
let utils = require('../utils/writer');
let Data = require('../utils/Data');

let sqlDb = Data.database;

exports.usersDbSetup = function(database) {
  sqlDb = database;
  console.log("Checking if clients table exists");
  return database.schema.hasTable(Data.Tables.user).then(exists => {
    if (!exists) {
      console.log("Clients doesn't exists");
    } else {
      console.log("Clients table exists");
    }
  });
};

/**
 * Create user
 * Register an user on the site
 *
 * username The username for login
 * password The password for login
 * no response value expected for this operation
 **/
exports.createUser = function(name, surname, email, password, address, userid) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(password, 10).then((hash) => {
      var id = userid ? userid : shortid.generate();
      return sqlDb(Data.Tables.user)
      .returning('id')
      .insert({
        id: id,
        name: name,
        surname: surname,
        email: email,
        password: hash,
        address: address
      });
    })
    .then((client_id) => {
      console.log(`New user registered with id: ${client_id}`);
      resolve(client_id);
    })
    .catch((val) => {
      console.log(val);
      reject(utils.respondWithCode(400, '{"message": "operation failed"}'));
    });

  });
}


/**
 * Logs user into the system
 *
 *
 * username String The user name for login
 * password String The password for login
 * returns String
 **/
exports.loginUser = function(email,password) {
  return new Promise(function(resolve, reject) {
    sqlDb.select().from(Data.Tables.user).where({email: email})
      .then(user => {
        console.log("found: " + Object.keys(user).length);
        if(Object.keys(user).length > 0) {
          bcrypt.compare(password, user[0].password).then(res => {
            console.log(res);
            if(res == true){
              resolve(user[0].id);
            } else {
              // Wrong password
              reject(utils.respondWithCode(400, '{"message": "Wrong username or password"}'));
            }
          });
        } else {
          // Wrong email
          reject(utils.respondWithCode(400, '{"message": "Wrong username or password"}'));
        }
      });




  //   var examples = {};
  //   examples['application/json'] = "";
  //   if (Object.keys(examples).length > 0) {
  //     resolve(examples[Object.keys(examples)[0]]);
  //   } else {
  //     resolve();
  //   }
  });
}


/**
 * Delete user
 * This can only be done by the logged in user.
 *
 * username String The name that needs to be deleted
 * no response value expected for this operation
 **/
exports.deleteUser = async function(user_id) {
  try{
    const data = await sqlDb(Data.Tables.author).where('id', user_id).del();
    return new Promise(function(resolve, reject) {
      resolve(Codes.OK, data);
    });
  } catch(e){
    console.log(err);
    reject(utils.respondWithCode(Codes.GENERIC_ERROR, `{"message": "${err}"`))
  }
}


/**
 * Get user by user name
 *
 *
 * username String The name that needs to be fetched. Use user1 for testing.
 * returns User
 **/
exports.getUserByName = function(username) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "firstName" : "firstName",
  "lastName" : "lastName",
  "password" : "password",
  "phone" : "phone",
  "id" : 0,
  "email" : "email",
  "username" : "username"
  };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Logs out current logged in user session
 *
 *
 * no response value expected for this operation
 **/
exports.logoutUser = function() {

  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Updated user
 * This can only be done by the logged in user.
 *
 * username String name that need to be updated
 * body User Updated user object
 * no response value expected for this operation
 **/
exports.updateUser = function(username,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}
