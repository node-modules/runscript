runscript
=======

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
<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/156269?v=4" width="100px;"/><br/><sub><b>fengmk2</b></sub>](https://github.com/fengmk2)<br/>|[<img src="https://avatars.githubusercontent.com/u/9939767?v=4" width="100px;"/><br/><sub><b>walkthunder</b></sub>](https://github.com/walkthunder)<br/>|[<img src="https://avatars.githubusercontent.com/u/360661?v=4" width="100px;"/><br/><sub><b>popomore</b></sub>](https://github.com/popomore)<br/>|[<img src="https://avatars.githubusercontent.com/u/1622697?v=4" width="100px;"/><br/><sub><b>ottomao</b></sub>](https://github.com/ottomao)<br/>|[<img src="https://avatars.githubusercontent.com/u/227713?v=4" width="100px;"/><br/><sub><b>atian25</b></sub>](https://github.com/atian25)<br/>|[<img src="https://avatars.githubusercontent.com/u/8433821?v=4" width="100px;"/><br/><sub><b>lusyn</b></sub>](https://github.com/lusyn)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |
[<img src="https://avatars.githubusercontent.com/u/5856440?v=4" width="100px;"/><br/><sub><b>whxaxes</b></sub>](https://github.com/whxaxes)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Tue Mar 08 2022 10:02:22 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->
