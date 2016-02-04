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

const spawn = require('child_process').spawn;

module.exports = function runScript(script, options) {
  return new Promise((resolve, reject) => {
    options = options || {};
    options.env = options.env || Object.create(process.env);
    options.cwd = options.cwd || process.cwd();
    options.stdio = options.stdio || 'inherit';

    let sh = 'sh';
    let shFlag = '-c';

    if (process.platform === 'win32') {
      sh = process.env.comspec || 'cmd';
      shFlag = '/d /s /c';
      options.windowsVerbatimArguments = true;
    }

    const proc = spawn(sh, [shFlag, script], options);
    proc.on('error', reject);

    proc.on('close', code => {
      if (code > 0) {
        return reject(new Error('Exit code ' + code));
      }
      return resolve();
    });
  });
};
