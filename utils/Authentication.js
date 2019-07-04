let shortid = require('shortid');
let jwt = require('jsonwebtoken');

// exports.ensureToken = function(req) {
//   var header = req.header.["authorization"];
//   if (typeof header !== 'undefined'){
//     let bearer = bearerHeader.split(" ");
//     let bearerToken = bearer[1];
//     return bearerToken;
//   }
// }
let generateUserId = function() {
  let id = shortid.generate();
  return id;
}

module.exports.generateUserId = generateUserId;

exports.getUserId = function(req){
  if(!req.session.userid){
      let id = generateUserId();
      req.session.userid = id;
  }
  return req.session.userid;
}

exports.createToken = function(userId) {
  return new Promise((resolve, reject) => {
    try{
      let token = jwt.sign({userId: userId}, process.env.SECRET_SESSION1 || 'secret', {expiresIn: '86405000', jwtid: shortid.generate()});
      resolve(token);
    } catch (e) {
       /*
        e = {
          name: 'NotBeforeError',
          message: 'jwt not active',
          date: 2018-10-04T16:10:44.000Z
        }
      */
      console.log(e);
      reject(e);
    }
  });
}

exports.authenticateRequest = function(req) {
  return new Promise((resolve, reject) => {
    console.log(req.cookies)
    if(req.cookies.token) {
      var token = req.cookies.token;
      try {
      var decoded = jwt.verify(token, process.env.SECRET_SESSION1 || 'secret');
      console.log(decoded)
      resolve(decoded);
      } catch (e) {
        /*
          e = {
            name: 'NotBeforeError',
            message: 'jwt not active',
            date: 2018-10-04T16:10:44.000Z
          }
        */
        console.log(e);
        reject(e);
      }
      
    } else {
      reject('{"message":"Token not found"}');
    }
  });
}