process.env.DEBUG = '*';
var lazyDebug = require('../src');

lazyDebug(__filename)('it works?');

lazyDebug(__filename, 'sub')('debugger for submodule');

lazyDebug(__filename, {packageName: true})('includes package name');

lazyDebug
  (__filename, {packageName: 'fake', submoduleName: 'sub2'})
  ('fake package name + submodule');
