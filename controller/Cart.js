'use strict'

var utils = require('../utils/writer.js');
var auth = require('../utils/Authentication');
var Cart = require('../service/CartService');

module.exports.addToCart = function addToCart (req, res, next) {
    var userid = getUserId(req);
    var isbn = req.swagger.params.body.value.isbn;
    var qty = req.swagger.params.body.value.quantity;
    // console.log(userid)
    // console.log(isbn)
    // console.log(qty)
    Cart.addItem(userid, isbn, qty)
    .then(response => {
        utils.writeJson(res, response);
    })
    .catch(err => {
        utils.writeJson(res, err);
    })
    
}


module.exports.removeFromCart = function removeFromCart(req, res, next) {
    var userid = getUserId(req);
    var isbn = req.swagger.params['isbn'].value;

    Cart.removeItem(userid, isbn)
    .then(response => {
        utils.writeJson(res, response);
    })
    .catch(err => {
        utils.writeJson(res, err);
    });
}

module.exports.getCart = function getCart(req, res, next) {
    var userid = getUserId(req);
    Cart.getUserCart(userid)
    .then(response => {
        utils.writeJson(res, response);
    })
    .catch(err => {
        utils.writeJson(res, err);
    });
}


function getUserId(req){
    if(!req.session.userid){
        let id = auth.generateUserId();
        req.session.userid = id;
    }
    return req.session.userid;
}