var expect = require('chai').expect;

var isNodeJs = require('detect-node');

describe('lazy-debug', function () {
  var lazyDebug = require('../src');

  it('is shortcut for #get', function () {
    expect(lazyDebug).to.equal(lazyDebug.get);
  });

  describe('#get(filename, submoduleName|options)', function () {
    it('returns named debug instance', function () {
      lazyDebug.get(__filename)('this should be function');
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
    
    it('adds real package name in node.js', function () {
      if (!isNodeJs) this.skip()
      
      expect(
        lazyDebug.getModuleDebugName(__filename, {packageName: true})
      ).to.equal('lazy-debug:test:01-lazy-debug-test');
    });


    it('uses "app" as package name in browser', function () {
        if (isNodeJs) this.skip()

        expect(
          lazyDebug.getModuleDebugName(__filename, {packageName: true})
        ).to.equal('app:test:01-lazy-debug-test');
    })

    it('sets package name if given', function () {
      expect(
        lazyDebug.getModuleDebugName(__filename, {packageName: 'fake'})
      ).to.equal('fake:test:01-lazy-debug-test');
    })
  });
});
