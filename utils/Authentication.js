let shortid = require('shortid');

// exports.ensureToken = function(req) {
//   var header = req.header.["authorization"];
//   if (typeof header !== 'undefined'){
//     let bearer = bearerHeader.split(" ");
//     let bearerToken = bearer[1];
//     return bearerToken;
//   }
// }

exports.generateUserId = function() {
  let id = shortid.generate();
  return id;
}

exports.getUserId = function(req){
  if(!req.session.userid){
      let id = auth.generateUserId();
      req.session.userid = id;
  }
  return req.session.userid;
}