
describe('lazy-debug', function () {
  var lazyDebug = require('../src');
  describe('#get(filename, submoduleName|options)', function () {
    it('returns named debug instance', function () {
      lazyDebug.get(__filename)('it works, I hope');
    });
  });
  describe('#getModuleDebugName(filename, submoduleName|options)', function () {
    it('gives debug name for file', function () {
      var name = lazyDebug.getModuleDebugName(__filename);
      expect(name).to.equal('test:01-lazy-debug-test');
    });
    
    it('adds submodule name if given', function () {
      
      expect(
        lazyDebug.getModuleDebugName(__filename, 'test2-1')
      ).to.equal('test:01-lazy-debug-test:test2-1');
      
      expect(
        lazyDebug.getModuleDebugName(__filename, {submoduleName: 'test2-2'}))
      .to.equal('test:01-lazy-debug-test:test2-2');
    });
    
    it('adds package name if given', function () {

      expect(
        lazyDebug.getModuleDebugName(__filename, {packageName: true})
      ).to.equal('lazy-debug:test:01-lazy-debug-test');
      
      expect(
        lazyDebug.getModuleDebugName(__filename, {packageName: 'fake'})
      ).to.equal('fake:test:01-lazy-debug-test');
    });
  });
});
