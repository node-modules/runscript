'use strict';

const is = require('is-type-of');
const assert = require('assert');
const spawn = require('child_process').spawn;

/**
 * Run shell script in child process
 * Support OSX, Linux and Windows
 * @param {String} script - full script string, like `git clone https://github.com/node-modules/runscript.git`
 * @param {Object} [options] - spawn options, @see https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 * @param {Function} [options.onStart] - callback with `proc` when start
 * @return {Promise} stdio object, will contains stdio.stdout and stdio.stderr buffer.
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
    }

    const onStart = options.onStart;
    options.onStart = undefined;

    const proc = spawn(sh, [ shFlag, script ], options);
    const stdout = [];
    const stderr = [];

    if (typeof onStart === 'function') {
      onStart(proc);
    }
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
