
describe('lazy-debug', function () {
  var lazyDebug = require('../src');
  describe('#get(filename, submoduleName)', function () {
    it('returns named debug instance', function () {
      lazyDebug.get(__filename)('it works, I hope');
    });
  });
  describe('#getModuleDebugName(filename, submoduleName)', function () {
    it('gives debug name for file', function () {
      var name = lazyDebug.getModuleDebugName(__filename);
      expect(name).to.equal('test:01-lazy-debug-test');
    });
    it('attaches submodule name if given', function () {
      var name = lazyDebug.getModuleDebugName(__filename, 'test2');
      expect(name).to.equal('test:01-lazy-debug-test:test2');
    });
  });
  describe('#configure', function () {
    it('can set filter function', function () {
      lazyDebug.configure({
        filter: function (pathArr) {
          if ( pathArr && pathArr.length > 0 ) {
            if ( pathArr[0] === 'test' )
              pathArr.shift();
          }
          return pathArr;
        }
      });
      var name = lazyDebug.getModuleDebugName(__filename);
      expect(name).to.equal('01-lazy-debug-test');
    });
  });
});
