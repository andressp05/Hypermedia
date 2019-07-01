'use strict'

var utils = require('../utils/writer.js');
var auth = require('../utils/Authentication');
var Cart = require('../service/CartService');

module.exports.addToCart = function addToCart (req, res, next) {
    // var userid = auth.authenticateRequest(req);
    auth.authenticateRequest(req).then(async (decoded) => {
        var userid = decoded.userId;

        var isbn = req.swagger.params.body.value.isbn;
        var qty = req.swagger.params.body.value.quantity;
        // console.log(userid)
        // console.log(isbn)
        // console.log(qty)
        var added = await Cart.addItem(userid, isbn, qty);
        var cart = await Cart.getUserCart(userid);
        utils.writeJson(res, cart);
    })
    .catch(err => {
        utils.writeJson(res, err, 401);
    })
}


module.exports.updateQuantity = function updateQuantity(req, res, next) {
    var isbn = req.swagger.params.body.value.isbn;
    var qty = req.swagger.params.body.value.quantity;

    auth.authenticateRequest(req).then(async (decoded) => {
        var userid = decoded.userId;
        console.log(userid)
        var removed = await Cart.updateItemQuantity(userid, isbn, qty);
        var cart = await Cart.getUserCart(userid);
        utils.writeJson(res, cart);
    })
    .catch(err => {
        utils.writeJson(res, err, 401);
    })
}


module.exports.removeFromCart = function removeFromCart(req, res, next) {
    auth.authenticateRequest(req).then(async (decoded) => {
        var userid = decoded.userId;
        var isbn = req.swagger.params['isbn'].value;
        console.log(userid)
        var removed = await Cart.removeItem(userid, isbn);
        var cart = await Cart.getUserCart(userid);
        utils.writeJson(res, cart);
    })
    .catch(err => {
        utils.writeJson(res, err, 401);
    });
}

module.exports.getCart = function getCart(req, res, next) {
    // var userid = auth.getUserId(req);
    auth.authenticateRequest(req).then(async (decoded) => {
        var userid = decoded.userId;
        console.log(userid)
        var cart = await Cart.getUserCart(userid);
        utils.writeJson(res, cart);
    })
    .catch(err => {
        utils.writeJson(res, err, 401);
    });
}