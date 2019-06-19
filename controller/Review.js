'use strict';

var utils = require('../utils/writer.js');
var Review = require('../service/ReviewService.js');

module.exports.getReviews = function getReviews (req, res, next) {
  var isbn = req.swagger.params['isbn'].value;
  Review.getBookReviews(isbn)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};