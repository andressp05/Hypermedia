'use strict'

var utils = require('../utils/writer.js');
var auth = require('../utils/Authentication');
var Cart = require('../service/CartService');

module.exports.addToCart = function addToCart (req, res, next) {
    if(req.session.loggedin && req.session.loggedin == true) {
        let userid = req.session.userid ? req.session.userid : auth.generateUserId();
        var isbn = req.swagger.params.body.value.isbn;
        var qty = req.swagger.params.body.value.quantity;
        console.log(userid)
        console.log(isbn)
        console.log(qty)
        Cart.addItem(userid, isbn, qty)
        .then(response => {
            utils.writeJson(res, response);
        })
        .catch(err => {
            utils.writeJson(res, err);
        })
    }

}