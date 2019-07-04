'use strict';

var cookie = require('cookie');

var utils = require('../utils/writer.js');
var User = require('../service/UserService.js');
var auth = require('../utils/Authentication');

module.exports.createUser = function createUser (req, res, next) {
  var name = req.swagger.params['name'].value;
  var surname = req.swagger.params['surname'].value;
  var email = req.swagger.params['email'].value;
  var password = req.swagger.params['password'].value;
  var address = req.swagger.params['address'].value;
  if(req.session.loggedin && req.session.loggedin == true){
    utils.writeJson(res, utils.respondWithCode(403, '{"message": "user already logged in"}'));
  } else {
    User.createUser(name,surname,email,password,address, req.session.userid)
      .then(async function (response) {
        console.log(`User ${response} registered`);
        var token = await auth.createToken(response);
        console.log(`Generated token ${token}`);
        res.cookie("token", token, {maxAge: 3500000, httpOnly: true});
        res.cookie('logged', 'true' , {maxAge: 3500000});
        utils.writeJson(res, {token: token});
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
};

module.exports.loginUser = function loginUser (req, res, next) {
  var username = req.swagger.params['email'].value;
  var password = req.swagger.params['password'].value;
  // if(req.session.loggedin && req.session.loggedin == true && req.session.userid) {
  
    User.loginUser(username,password)
      .then(function (response) {
        // req.session.loggedin = true;
        // if (req.session.userid && req.session.userid != response) {
        
        // }
        // res.cookie('logged', 'true' , {maxAge: req.sessionOptions.maxAge});
        // req.session.userid = response;
        console.log(`User ${response} logged in`);

        auth.createToken(response).then(token => {
          console.log(`Generated token ${token}`);
          res.cookie("token", token, {maxAge: 86400000, httpOnly: true});
          res.cookie('logged', 'true' , {maxAge: 86400000});
          utils.writeJson(res, {token: token});
        });
        
        // utils.writeJson(res, response);
      })
      .catch(function (response) {
        console.log('loginUser error! ' + response)
        req.session.loggedin = false;
        req.session.userid = null;
        utils.writeJson(res, response);
      });
  
};

module.exports.logoutUser = function logoutUser (req, res, next) {
  // req.session.loggedin = false;
  // req.session.userid = null;
  res.cookie('logged', 'false');
  // res.cookie('token', null, {expires: "Thu, 01 Jan 1970 00:00:00 GMT"});
  res.clearCookie('token');
  User.logoutUser()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
