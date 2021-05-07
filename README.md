runscript
=======

[![NPM version][npm-image]][npm-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/runscript.svg?style=flat-square
[npm-url]: https://npmjs.org/package/runscript
[codecov-image]: https://codecov.io/github/node-modules/runscript/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/node-modules/runscript?branch=master
[david-image]: https://img.shields.io/david/node-modules/runscript.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/runscript
[download-image]: https://img.shields.io/npm/dm/runscript.svg?style=flat-square
[download-url]: https://npmjs.org/package/runscript

Run script easy!

## Installation

```bash
$ npm install runscript
```

## Quick start

```js
const runScript = require('runscript');

runScript('node -v', { stdio: 'pipe' })
  .then(stdio => {
    console.log(stdio);
  })
  .catch(err => {
    console.error(err);
  });
```

### run with timeout

Run user script for a maximum of 10 seconds.

```js
const runScript = require('runscript');

runScript('node user-script.js', { stdio: 'pipe' }, { timeout: 10000 })
  .then(stdio => {
    console.log(stdio);
  })
  .catch(err => {
    console.error(err);
  });
```

## License

[MIT](LICENSE.txt)
