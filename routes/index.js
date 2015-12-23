var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/peer1', function(req, res, next) {
  res.render('peer1');
});

router.get('/peer2', function(req, res, next) {
  res.render('peer2');
});


module.exports = router;
