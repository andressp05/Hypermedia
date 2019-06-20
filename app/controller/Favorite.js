'use strict';

var utils = require('../utils/writer.js');
var Favorite = require('../service/FavoritesService.js');

module.exports.favoritesGET = function favoritesGET (req, res, next) {
  var offset = req.swagger.params['offset'].value;
  var limit = req.swagger.params['limit'].value;
  Favorite.favoritesGET(offset,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
