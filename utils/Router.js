
let path = require('path');

let router = require('express').Router();

router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.get('/pages/books.html', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', 'pages', 'books.html'));
});

module.exports = router;