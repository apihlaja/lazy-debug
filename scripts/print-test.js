process.env.DEBUG = '*';

var debug = require('../src').get(__filename);

debug('it works?');