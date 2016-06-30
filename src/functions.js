var path = require('path');

var functions = module.exports = {
  parseFilePath (file, platform, filter) {
    var delimiter = '/';
    if (typeof platform == 'function') {
      filter = platform;
      platform = false;
    }
    if (!platform) { platform = process.platform };
    if (platform === 'win32') {
      delimiter = '\\';
    }
    if (platform === 'browser') {
      if ( file.indexOf('\\') === 0 ) {
        file = file.substr(1,file.length);
      }
    }
    // should be posix..
    var candidates = file.split(delimiter);
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
    if ( filter && typeof filter === 'function' ) {
      return filter(modules);
    }
    return modules;
  },
  locatePackageJson(filePath, platform) {
    if (!platform) { platform = process.platform };
    var pathParts = functions.parseFilePath(filePath, platform);
    var filedir = path.dirname(filePath);
    var testdir = filedir;
    var counter = 1;
    var result;
    while (pathParts.length-1 !== counter ) {
      try {
        var testfile = path.join(testdir, 'package.json');
        return require.resolve(testfile);
      } catch( err ) {
        // ignore
      }
      var testdir = path.resolve(testdir, '..');
      counter++;
    }
    return false;
  },
  getModuleDebugId(filePath, platform, filter) {
    if (typeof platform == 'function') {
      filter = platform;
      platform = false;
    }
    if (!platform) { platform = process.platform };
    var packagePath = functions.locatePackageJson(filePath, platform);
    var packageName = (packagePath) ? 
      require(packagePath).name : functions.getPseudoName(filePath);
    var relpath = (packagePath) ? 
      path.relative(packagePath, filePath) : functions.findModuleRoot(filePath);
    var submodules = functions.parseFilePath(relpath, filter);
    return packageName + ':' + submodules.join(':');
  },
  getPseudoName(filePath) {
    var search = 'node_modules/';
    var idx = filePath.lastIndexOf(search);
    if ( idx === -1 ) return 'app';
    var moduleRoot = functions.findModuleRoot(filePath);
    return moduleRoot.substr(0, moduleRoot.indexOf('/'));
  },
  findModuleRoot(filePath) {
    var search = 'node_modules/';
    var idx = filePath.lastIndexOf(search);
    if ( idx === -1 ) return filePath.substr(1);
    return filePath.substr(idx+search.length);
  }
}

function removeFileExt(fileName) {
  var index = fileName.lastIndexOf('.');
  if ( index !== -1 )
    return fileName.substr(0, index);
  else
    return fileName;
}
