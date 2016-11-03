process.env.DEBUG = '*';
var lazyDebug = require('../src');

lazyDebug.get(__filename)('it works?');

lazyDebug.get(__filename, 'sub')('debugger for submodule');

lazyDebug.get(__filename, {packageName: true})('includes package name');

lazyDebug.get
  (__filename, {packageName: 'fake', submoduleName: 'sub2'})
  ('fake package name + submodule');
