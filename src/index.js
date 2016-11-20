var debug = require('debug');

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

// internals..

var path = require('path');

var fs;
try {
  fs = require('fs');
} catch (e) {}
 

var isNodeJs = require('detect-node');
var isWin32 = isNodeJs && process.platform === 'win32'
var isWebpack = !isNodeJs && (typeof process === 'undefined' || process.platform !== 'browser')

function detectSeparator(file) {
  if (isNodeJs) return path.sep;
  
  // try to guess in browser
  if (file.indexOf('\\') !== -1) {
    return '\\'
  } else {
    return '/'
  }
}

function parseFilePath(file) {

  var separator = detectSeparator(file)

  if (separator === '\\' && file.indexOf('/') === 0) {
    file = file.substr(1,file.length);
  }
  
  var candidates = file.split(separator);
  var modules = [];
  for ( var i = 0; i < candidates.length; ++i ) {
    if (candidates[i] && candidates[i].length ) {
      modules.push(candidates[i]);
    }
  }
  var last = modules.length - 1;
  if ( last > 0 ) {
    var fileName = removeFileExt(modules[last]);
    if ( fileName === 'index' ) {
      modules.pop();
    } else {
      modules[last] = fileName;
    }
  }
  if ( modules.length > 0 ) {
    if ( modules[0] === '..' ) {
      modules.shift();
    }
  }
  return modules;
}

function locatePackageJson(filePath) {
  var pathParts = parseFilePath(filePath);
  var filedir = path.dirname(filePath);
  var testdir = filedir;
  var counter = 1;
  var result;

  // can't find in browserify/webpack build
  if (!isNodeJs) return false;

  while (pathParts.length > counter ) {
    try {
      var testfile = path.join(testdir, 'package.json');
      if (fs.existsSync(testfile)) {
        return testfile
      }
    } catch( err ) {
      // ignore
    }
    var testdir = path.resolve(testdir, '..');
    counter++;
  }
  return false;
}

function getModuleDebugId(filePath, options) {
  options = options || {};
  
  var packagePath = locatePackageJson(filePath);
  var relpath = (packagePath) ?
    path.relative(packagePath, filePath) : findModuleRoot(filePath);
  var submodules = parseFilePath(relpath);

  return submodules.join(':');
}

function getPackageName(filePath) {
  var packagePath = locatePackageJson(filePath);

  if (packagePath) {
    return JSON.parse(fs.readFileSync(packagePath, {encoding: 'utf-8'})).name
  } else {
    return getPseudoName(filePath)
  }
}

function getPseudoName(filePath) {
  var search = 'node_modules';
  var idx = filePath.lastIndexOf(search);
  
  if ( idx === -1 ) return 'app';
  
  var moduleRoot = findModuleRoot(filePath);
  
  if ( filePath.lastIndexOf('node_modules/') !== -1 )
    return moduleRoot.substr(0, moduleRoot.indexOf('/'));
  else
    return moduleRoot.substr(0, moduleRoot.indexOf('\\'));
}

function findModuleRoot(filePath) {
  var search = 'node_modules';
  var idx = filePath.lastIndexOf(search);
  if ( idx === -1 ) {
    return (isWebpack) ? filePath : filePath.substr(1);
  } 
  return filePath.substr(idx+1+search.length);
}

function removeFileExt(fileName) {
  var index = fileName.lastIndexOf('.');
  if ( index !== -1 )
    return fileName.substr(0, index);
  else
    return fileName;
}
