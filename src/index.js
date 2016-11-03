var debug = require('debug');
var getModuleDebugId = require('./functions').getModuleDebugId;
var getPackageName = require('./functions').getPackageName;

var idCache = {};
var pkgNameCache = {};

var api = module.exports = {
  get: function( filename, options ) {
    return debug(api.getModuleDebugName(filename, options));
  },
  getModuleDebugName: function ( filename, options ) {
    var name = idCache[filename];
    
    options = options || {};
    
    if ( typeof options === 'string'  ) {
      options = {submoduleName: options}
    }
    
    if ( !name ) {
      name = getModuleDebugId(filename, {platform: process.platform});
      idCache[filename] = name;
    }
    
    if (options.submoduleName){
      name += ':' + options.submoduleName;
    }
    
    if (options.packageName) {
      var pkgName;
      
      if (typeof options.packageName === 'string') {
        pkgName = options.packageName;
      }
      else {
        pkgName = pkgNameCache[filename];
        if (!pkgName) {
          pkgName = getPackageName(filename);
          pkgNameCache[filename] = pkgName;
        }
      }
      name = pkgName + ':' + name;
    }
    
    return name;
  }
};
