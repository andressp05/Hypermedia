

exports.ensureToken = function(req) {
  var header = req.header.["authorization"];
  if (typeof header !== 'undefined'){
    let bearer = bearerHeader.split(" ");
    let bearerToken = bearer[1];
    return bearerToken;
  }
}
