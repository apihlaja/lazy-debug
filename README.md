# lazy-debug

[![Travis Build Status](https://travis-ci.org/apihlaja/lazy-debug.svg?branch=master)](https://travis-ci.org/apihlaja/lazy-debug) [![Appveyor Build status](https://ci.appveyor.com/api/projects/status/yihkfbm7e89h1ngf/branch/master?svg=true)](https://ci.appveyor.com/project/apihlaja/lazy-debug/branch/master)

**__UNMAINTAINED__**: this was developed for webpack v1, not tested since then (v4 is out now).

**lazy-debug** is a helper for [visionmedia´s debug](https://github.com/visionmedia/debug). It generates module identifiers based on `__filename`, so your debug identifiers reflect the file structure automatically.

[![console log](https://raw.githubusercontent.com/apihlaja/lazy-debug/master/examples/express/output.png?raw=true)](https://github.com/apihlaja/lazy-debug/tree/master/examples/express)

Supports

  * Node.js v0.10 and later
  * Windows and Linux
  * Browserify
  * Webpack

## Install

`npm install --save debug lazy-debug`

The module works out of the box in Node.js and Browserify environments. 


### Webpack

Webpack needs [configuration](https://webpack.github.io/docs/configuration.html#node), include these in your `webpack.config.js`:

```javascript
config.node = {
  __filename: true, // populates filenames relative to your app root
  fs: "empty"       // include empty "mock" for fs module
}
```

## Usage

Just require it and provide filename:

```javascript
var debug = require('lazy-debug')(__filename)
debug('ready for logging..')
```
Debugger identifier will be relative to module root, ie. something like `dir:file`. File extensions are omitted and file name is omitted if it´s `index`.


### Suffix

Add suffix by providing `submoduleName`:

```javascript
var debug = require('lazy-debug')(__filename, {submoduleName: 'sub'})
var debug = require('lazy-debug')(__filename, 'sub')
```
Debugger identifier will be `dir:file:sub`.


### Prefix

Add prefix by providing `packageName`:

```javascript
var debug = require('lazy-debug')(__filename, {packageName: 'my-lib'})
var debug = require('lazy-debug')(__filename, {packageName: true})
```

Debugger identifier will be `my-lib:dir:file`. If package name is boolean `true`, name from `package.json` is used. That works only in Node.js environment.


## Tests

`npm test`

Tests node.js compability by running vanilla [Mocha](https://mochajs.org/) at first, then Browserify and Webpack builds are tested in [PhantomJS](http://phantomjs.org/) using [Karma](http://karma-runner.github.io/).


## License

[The MIT License](LICENSE.md)
