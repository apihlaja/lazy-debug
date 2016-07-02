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
      var sample = '/path\\dir\\file.txt';
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
  describe('#findModuleRoot(filePath)', function () {
    var findModuleRoot = functions.findModuleRoot;
    it('finds module root in browserify', function () {
      expect(findModuleRoot('/lib')).to.equal('lib');
      expect(findModuleRoot('/node_modules/lib2')).to.equal('lib2');
      expect(findModuleRoot('/node_modules\\lib2')).to.equal('lib2');
      expect(findModuleRoot('/node_modules/lib2/node_modules/lib3')).to.equal('lib3');
      expect(findModuleRoot('/node_modules\\lib2\\node_modules\\lib3')).to.equal('lib3');
    })
  });
  describe('#getPseudoName(filePath)', function () {
    var getPseudoName = functions.getPseudoName;

    it('returns "app" for root', function () {
      expect(getPseudoName('/')).to.equal('app');
    });
    it('returns module dir name if inside /node_modules/', function () {
      expect(getPseudoName('/node_modules/my-lib/file.js')).to.equal('my-lib');
      expect(getPseudoName('/node_modules\\my-lib\\file.js')).to.equal('my-lib');
    });
    it('returns module dir name even if nested', function () {
      expect(getPseudoName('/node_modules/my-lib/node_modules/lib2/file.js')).to.equal('lib2');
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
      expect(getModuleDebugId('/web\\browser.jsx'))
        .to.equal('app:web:browser')
    });
  });
});
