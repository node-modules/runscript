'use strict';

const debug = require('debug')('runscript');
const is = require('is-type-of');
const assert = require('assert');
const path = require('path');
const spawn = require('child_process').spawn;

/**
 * Run shell script in child process
 * Support OSX, Linux and Windows
 * @param {String} script - full script string, like `git clone https://github.com/node-modules/runscript.git`
 * @param {Object} [options] - spawn options
 *   @see https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 * @return {Object} stdio object, will contains stdio.stdout and stdio.stderr buffer.
 */
module.exports = function runScript(script, options) {
  return new Promise((resolve, reject) => {
    options = options || {};
    options.env = options.env || Object.create(process.env);
    options.cwd = options.cwd || process.cwd();
    options.stdio = options.stdio || 'inherit';
    if (options.stdout) assert(is.writableStream(options.stdout), 'options.stdout should be writable stream');
    if (options.stderr) assert(is.writableStream(options.stderr), 'options.stderr should be writable stream');

    let sh = 'sh';
    let shFlag = '-c';

    if (process.platform === 'win32') {
      sh = process.env.comspec || 'cmd';
      shFlag = '/d /s /c';
      options.windowsVerbatimArguments = true;
      if (script.indexOf('./') === 0 || script.indexOf('.\\') === 0 ||
          script.indexOf('../') === 0 || script.indexOf('..\\') === 0) {
        const splits = script.split(' ');
        splits[0] = path.join(options.cwd, splits[0]);
        script = splits.join(' ');
      }
    }

    debug('%s %s %s, %j', sh, shFlag, script, options);
    const proc = spawn(sh, [ shFlag, script ], options);
    const stdout = [];
    const stderr = [];
    if (proc.stdout) {
      proc.stdout.on('data', buf => {
        stdout.push(buf);
      });
      if (options.stdout) {
        proc.stdout.pipe(options.stdout);
      }
    }
    if (proc.stderr) {
      proc.stderr.on('data', buf => {
        stderr.push(buf);
      });
      if (options.stderr) {
        proc.stderr.pipe(options.stderr);
      }
    }
    proc.on('error', reject);
    proc.on('close', code => {
      const stdio = {
        stdout: null,
        stderr: null,
      };
      if (stdout.length > 0) {
        stdio.stdout = Buffer.concat(stdout);
      }
      if (stderr.length > 0) {
        stdio.stderr = Buffer.concat(stderr);
      }
      if (code !== 0) {
        const err = new Error(`Run "${sh} ${shFlag} ${script}" error, exit code ${code}`);
        err.stdio = stdio;
        return reject(err);
      }
      return resolve(stdio);
    });
  });
};
