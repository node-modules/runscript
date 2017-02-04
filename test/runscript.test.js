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

const fs = require('fs');
const path = require('path');
const assert = require('assert');
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

  it('should pipe and get stdout string', () => {
    return runScript('node -v', {
      stdio: 'pipe',
    }).then(stdio => {
      console.log(stdio.stdout.toString());
      assert(Buffer.isBuffer(stdio.stdout));
      assert(/^v\d+\.\d+\.\d+$/.test(stdio.stdout.toString().trim()), JSON.stringify(stdio.stdout.toString()));
      assert.equal(stdio.stderr, null);
    });
  });

  it('should pipe and get stderr string', () => {
    return runScript('node -e "foo"', {
      stdio: 'pipe',
    }).catch(err => {
      assert(err.message.indexOf('node -e "foo"" error, exit code') > 0, err.message);
      const stdio = err.stdio;
      assert(Buffer.isBuffer(stdio.stderr));
      const stderr = stdio.stderr.toString();
      assert(stderr.indexOf('ReferenceError: foo is not defined') > -1, stderr);
      assert.equal(stdio.stdout, null);
    });
  });

  it('should not return stderr when stdio.stderr = inherit', () => {
    return runScript('node -e "foo"', {
      stdio: 'inherit',
    }).catch(err => {
      assert(err.message.indexOf('node -e "foo"" error, exit code') > 0, err.message);
      const stdio = err.stdio;
      assert.equal(stdio.stdout, null);
      assert.equal(stdio.stderr, null);
    });
  });

  it('should pipe and send to stdout and stderr stream', () => {
    const stdoutPath = path.join(__dirname, 'stdout.log');
    const stderrPath = path.join(__dirname, 'stderr.log');
    return runScript(`node ${path.join(__dirname, 'fixtures/console.js')}`, {
      stdio: 'pipe',
      stdout: fs.createWriteStream(stdoutPath),
      stderr: fs.createWriteStream(stderrPath),
    }).then(stdio => {
      assert(stdio.stdout.toString() === 'stdout');
      assert(stdio.stderr.toString() === 'stderr');
      assert(fs.readFileSync(stdoutPath, 'utf8') === 'stdout');
      assert(fs.readFileSync(stderrPath, 'utf8') === 'stderr');
    });
  });

  it('should throw when options.stdout is not writable stream', () => {
    return runScript('node -v', {
      stdout: fs.createReadStream(__filename),
    }).then(() => {
      throw new Error('should not run');
    }).catch(err => {
      assert(err.message === 'options.stdout should be writable stream');
    });
  });

  it('should throw when options.stderr is not writable stream', () => {
    return runScript('node -v', {
      stderr: fs.createReadStream(__filename),
    }).then(() => {
      throw new Error('should not run');
    }).catch(err => {
      assert(err.message === 'options.stderr should be writable stream');
    });
  });
});
