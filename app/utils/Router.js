
let path = require('path');

let router = require('express').Router();

router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.get('/backend/documentation.html', function(req, res, next){
  res.sendFile(path.join(__dirname, '../backend', 'documentation.html'));
});

/* NOT USEFULL THIS ARE ALREADY INCLUDED IN THE STATIC FILE HANDLING */
// router.get('/pages/books.html', function(req, res, next){
//   res.sendFile(path.join(__dirname, '../public', 'pages', 'books.html'));
// });
//
// router.get('/pages/authors.html', function(req, res, next){
//   res.sendFile(path.join(__dirname, '../public', 'pages', 'authors.html'));
// });


module.exports = router;
