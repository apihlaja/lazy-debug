var debug = require('lazy-debug')(__filename)
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  debug('sending users')
  res.send('respond with a resource');
});

module.exports = router;
