var debug = require('lazy-debug')(__filename)
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  debug('rendering index')
  res.render('index', { title: 'Express' });
});

module.exports = router;
