/**
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

const runScript = require('../');

describe('test/runscript.test.js', () => {
  it('should run `$ node -v`', () => {
    return runScript('node -v');
  });

  it('should run `$ npm -v`', () => {
    return runScript('npm -v');
  });

  it('should run `$ echo "hello"`', () => {
    return runScript('echo "hello"');
  });
});
