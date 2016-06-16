var debug = require('debug');
var getModuleDebugId = require('./functions').getModuleDebugId;
var filter;

var cache = {};

var api = module.exports = {
  configure(opts) {
    if ( !opts ) opts = {};
    if ( opts.filter && typeof opts.filter === 'function' ) {
      filter = opts.filter;
      cache = {};
    }
  },
  get( filename, submoduleName ) {
    return debug(api.getModuleDebugName(filename, process.platform, filter));
  },
  getModuleDebugName: function ( filename, submoduleName ) {
    var name = cache[filename];
    if ( !name ) {
      name = getModuleDebugId(filename, process.platform, filter);
      cache[filename] = name;
    }
    if ( submoduleName ) {
      return name + ':' + submoduleName;
    } else {
      return name;
    }
  }
};
