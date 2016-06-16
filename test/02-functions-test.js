var functions = require('../src/functions');

describe('internal functions', function () {
  describe('#parseFilePath', function () {
    var parseFilePath = functions.parseFilePath;
    it('handles absolute posix paths', function () {
      var sample = '/home/user/dir/file.txt';
      expect(parseFilePath(sample, 'posix')).to.deep.equal([
        'home', 'user', 'dir', 'file'
      ]);
    });
    it('handles absolute win32 paths', function () {
      var sample = 'C:\\path\\dir\\file.txt';
      expect(parseFilePath(sample, 'win32')).to.deep.equal([
        'C:', 'path', 'dir', 'file'
      ]);
    });
    it('handles browserify paths', function () {
      var sample = '/path/dir/file.txt';
      expect(parseFilePath(sample, 'browser')).to.deep.equal([
        'path', 'dir', 'file'
      ]);
    });
    it('handles f*** up browserify paths', function () {
      var sample = '\\path/dir/file.txt';
      expect(parseFilePath(sample, 'browser')).to.deep.equal([
        'path', 'dir', 'file'
      ]);
    });
    it('can take filter function as argument', function () {
      var sample = '/test/debug/script.js';
      var result = parseFilePath(sample, 'posix', function (pathArr) {
        if ( pathArr && pathArr.length > 0 ) {
          if ( pathArr[0] === 'test' ) 
            pathArr.shift();
        }
        return pathArr;
      });
      expect(result).to.deep.equal(['debug', 'script']);
    });
  });
  describe('#findPackageName', function () {
    var findPackageName = functions.findPackageName;
    it('finds package name in '+process.platform, function () {
      expect(findPackageName(__filename)).to.equal('lazy-debug');
    });
  });
  describe('#getModuleDebugId', function () {
    var getModuleDebugId = functions.getModuleDebugId;
    it('names modules based on __filename and package.json', function () {
      expect(getModuleDebugId(__filename))
        .to.equal('lazy-debug:test:02-functions-test');
      expect(getModuleDebugId(require('./dir1/submodule1')()))
        .to.equal('lazy-debug:test:dir1:submodule1');
      expect(getModuleDebugId(require('./dir1')()))
        .to.equal('lazy-debug:test:dir1');
      expect(getModuleDebugId(require('./dir1')()))
        .to.equal('lazy-debug:test:dir1');
    });
  });
});