let router = require('express').Router();

router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname,'www', 'index.html'));
});

module.exports = router;
