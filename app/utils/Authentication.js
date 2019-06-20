let shortid = require('shortid');

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