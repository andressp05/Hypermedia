'use strict';

var utils = require('../utils/writer.js');
var Sale = require('../service/SaleService.js');

module.exports.bestSellersGET = function bestSellersGET (req, res, next) {
  var offset = req.swagger.params['offset'].value;
  var limit = req.swagger.params['limit'].value;
  Sale.bestSellersGET(offset,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
