var expect = require('chai').expect;
var functions = require('../src/functions');

var isNodeJs = require('detect-node');

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
    it('names modules based on __filename', function () {
      expect(getModuleDebugId(__filename))
        .to.equal('test:02-functions-test');
      expect(getModuleDebugId(require('./dir1/submodule1')()))
        .to.equal('test:dir1:submodule1');
      expect(getModuleDebugId(require('./dir1')()))
        .to.equal('test:dir1');
    });
  });
  
  describe('#getPackageName', function () {
    var getPackageName = functions.getPackageName;
    
    it('finds package name based on __filename in node.js', function () {
      if (!isNodeJs) this.skip();

      expect(getPackageName(__filename))
          .to.equal('lazy-debug');
    });

    it('use "app" as package name in browser', function () {
      if (isNodeJs) this.skip()

      expect(getPackageName(__filename))
        .to.equal('app');
    });
  })
});
