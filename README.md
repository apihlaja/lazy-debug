# lazy-debug

[![npm lazy-debug](https://nodei.co/npm/lazy-debug.png?compact=true)](https://www.npmjs.com/package/lazy-debug)

Node.js module which generates app & module names for [visionmedia´s debug](https://github.com/visionmedia/debug) using `__filename` and package.json.


## Usage

```javascript
var debug = require('lazy-debug').get(__filename);
```

Debugger name is path to project/module root, ie. something like `dir1:dir2:file`. File extensions are omited and file name is omitted if the name is `index`.

```javascript
var debug = require('lazy-debug').get(__filename, {submoduleName: 'sub'});
// shorthand:
var debug = require('lazy-debug').get(__filename, 'sub');
```

Adds submodule name, ie. debug name will be `dir1:dir2:file:sub`.

```javascript
var debug = require('lazy-debug').get(__filename, {packageName: true});
```

Includes package name from package.json (`pkgName:dir1:dir2:file`).

```javascript
var debug = require('lazy-debug').get(__filename, {packageName: 'custom'});
```

Includes custom root name (`custom:dir1:dir2:file`)


## Install

`npm install --save debug lazy-debug`

## Tests

`npm test`

## License

[The MIT License](LICENSE.md)
