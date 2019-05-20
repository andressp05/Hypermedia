'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService.js');

module.exports.createUser = function createUser (req, res, next) {
  var name = req.swagger.params['name'].value;
  var surname = req.swagger.params['surname'].value;
  var email = req.swagger.params['email'].value;
  var password = req.swagger.params['password'].value;
  var address = req.swagger.params['address'].value;
  if(req.session.loggedin && req.session.loggedin === true){
    utils.respondWithCode(403, '{message: user already logged in}');
  } else {
    User.createUser(name,surname,email,password,address)
      .then(function (response) {
        req.session.loggedin = true;
        req.session.userid = response;
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
  if(req.session.loggedin && req.session.loggedin === true) {
    utils.respondWithCode(403, '{message: user already logged in}');
  } else {
    User.loginUser(username,password)
      .then(function (response) {
        req.session.loggedin = true;
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        req.session.loggedin = false;
        utils.writeJson(res, response);
      });
  }
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  var username = req.swagger.params['username'].value;
  User.deleteUser(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserByName = function getUserByName (req, res, next) {
  var username = req.swagger.params['username'].value;
  User.getUserByName(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.logoutUser = function logoutUser (req, res, next) {
  User.logoutUser()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateUser = function updateUser (req, res, next) {
  var username = req.swagger.params['username'].value;
  var body = req.swagger.params['body'].value;
  User.updateUser(username,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
