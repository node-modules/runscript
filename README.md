# runscript

📢📢📢📢📢 You should use [execa](https://github.com/sindresorhus/execa) instead. 📢📢📢📢

---

[![NPM version][npm-image]][npm-url]
[![Node.js CI](https://github.com/node-modules/runscript/actions/workflows/nodejs.yml/badge.svg)](https://github.com/node-modules/runscript/actions/workflows/nodejs.yml)
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/runscript.svg?style=flat-square
[npm-url]: https://npmjs.org/package/runscript
[codecov-image]: https://codecov.io/github/node-modules/runscript/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/node-modules/runscript?branch=master
[download-image]: https://img.shields.io/npm/dm/runscript.svg?style=flat-square
[download-url]: https://npmjs.org/package/runscript

Run script easy!

## Installation

```bash
npm install runscript
```

## Quick start

Commonjs

```js
const { runScript } = require('runscript');

runScript('node -v', { stdio: 'pipe' })
  .then(stdio => {
    console.log(stdio);
  })
  .catch(err => {
    console.error(err);
  });
```

ESM & TypeScript

```js
import { runScript } from 'runscript';

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
const { runScript } = require('runscript');

runScript('node user-script.js', { stdio: 'pipe' }, { timeout: 10000 })
  .then(stdio => {
    console.log(stdio);
  })
  .catch(err => {
    console.error(err);
  });
```

## Upgrade from 1.x to 2.x

```js
// 1.x
// const runscript = require('runscript');

// 2.x
const { runscript } = require('runscript');
```

## License

[MIT](LICENSE.txt)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=node-modules/runscript)](https://github.com/node-modules/runscript/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
