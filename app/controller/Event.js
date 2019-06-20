'use strict';

var utils = require('../utils/writer.js');
var Evento = require('../service/EventService.js');

module.exports.eventsGET = function eventsGET (req, res, next) {
  var offset = req.swagger.params['offset'].value;
  var limit = req.swagger.params['limit'].value;
  Evento.eventsGET(offset,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getEventById = function getEventById (req, res, next) {
  var eventId = req.swagger.params['eventId'].value;
  Evento.getEventById(eventId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
