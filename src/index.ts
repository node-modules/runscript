import { debuglog } from 'node:util';
import assert from 'node:assert';
import path from 'node:path';
import { spawn, spawnSync, type SpawnOptions } from 'node:child_process';
import { type Writable } from 'node:stream';
import { isWritable } from 'is-type-of';

const debug = debuglog('runscript');

function isCmd() {
  if (process.platform !== 'win32') {
    return false;
  }

  try {
    const result = spawnSync('ls', {
      stdio: 'pipe',
    });

    return result.error !== undefined;
  } catch (err) {
    return true;
  }
}

export interface Options extends SpawnOptions {
  stdout?: Writable;
  stderr?: Writable;
}

export interface ExtraOptions {
  timeout?: number;
}

export interface Stdio {
  stdout: Buffer | null;
  stderr: Buffer | null;
}

export interface StdError extends Error {
  stdio: Stdio;
}

export class RunScriptError extends Error {
  stdio: Stdio;
  exitcode: number | null;

  constructor(message: string, stdio: Stdio, exitcode: number | null, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    this.stdio = stdio;
    this.exitcode = exitcode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class RunScriptTimeoutError extends Error {
  stdio: Stdio;
  timeout: number;

  constructor(message: string, stdio: Stdio, timeout: number, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    this.stdio = stdio;
    this.timeout = timeout;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Run shell script in child process
 * Support OSX, Linux and Windows
 * @param {String} script - full script string, like `git clone https://github.com/node-modules/runscript.git`
 * @param {Object} [options] - spawn options
 *   @see https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 * @param {Object} [extraOptions] - extra options for running
 *   - {Number} [extraOptions.timeout] - child process running timeout
 * @return {Object} stdio object, will contains stdio.stdout and stdio.stderr buffer.
 */
export function runScript(script: string, options: Options = {}, extraOptions: ExtraOptions = {}): Promise<Stdio> {
  return new Promise((resolve, reject) => {
    options.env = options.env || Object.assign({}, process.env);
    options.cwd = options.cwd || process.cwd();
    if (typeof options.cwd === 'object') {
      // convert URL object to string
      options.cwd = String(options.cwd);
    }
    options.stdio = options.stdio || 'inherit';
    if (options.stdout) {
      assert(isWritable(options.stdout), 'options.stdout should be writable stream');
    }
    if (options.stderr) {
      assert(isWritable(options.stderr), 'options.stderr should be writable stream');
    }

    let sh = 'sh';
    let shFlag = '-c';

    if (process.platform === 'win32') {
      sh = process.env.comspec || 'cmd';
      shFlag = '/d /s /c';
      options.windowsVerbatimArguments = true;
      if (script.indexOf('./') === 0 || script.indexOf('.\\') === 0 ||
          script.indexOf('../') === 0 || script.indexOf('..\\') === 0) {
        const splits = script.split(' ');
        // in bash C:\Windows\system32 -> C:\\Windows\\system32
        splits[0] = path.join(isCmd() ? options.cwd : path.normalize(options.cwd), splits[0]);
        script = splits.join(' ');
      }
    }

    debug('%s %s %s, %j, %j', sh, shFlag, script, options, extraOptions);
    const proc = spawn(sh, [ shFlag, script ], options);
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let isEnd = false;
    let timeoutTimer: NodeJS.Timeout;

    if (proc.stdout) {
      proc.stdout.on('data', (buf: Buffer) => {
        debug('stdout %d bytes', buf.length);
        stdout.push(buf);
      });
      if (options.stdout) {
        proc.stdout.pipe(options.stdout);
      }
    }
    if (proc.stderr) {
      proc.stderr.on('data', (buf: Buffer) => {
        debug('stderr %d bytes', buf.length);
        stderr.push(buf);
      });
      if (options.stderr) {
        proc.stderr.pipe(options.stderr);
      }
    }

    proc.on('error', err => {
      debug('proc emit error: %s', err);
      if (isEnd) {
        return;
      }
      isEnd = true;
      clearTimeout(timeoutTimer);

      reject(err);
    });

    proc.on('exit', code => {
      debug('proc emit exit: %s', code);
      if (isEnd) {
        return;
      }
      isEnd = true;
      clearTimeout(timeoutTimer);

      const stdio: Stdio = {
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
        const err = new RunScriptError(
          `Run "${sh} ${shFlag} ${script}" error, exit code ${code}`, stdio, code);
        return reject(err);
      }
      return resolve(stdio);
    });

    proc.on('close', code => {
      debug('proc emit close: %s', code);
    });

    if (typeof extraOptions.timeout === 'number' && extraOptions.timeout > 0) {
      const timeout = extraOptions.timeout;
      // start timer
      timeoutTimer = setTimeout(() => {
        debug('proc run timeout: %dms', timeout);
        isEnd = true;
        debug('kill child process %s', proc.pid);
        proc.kill();

        const stdio: Stdio = {
          stdout: null,
          stderr: null,
        };
        if (stdout.length > 0) {
          stdio.stdout = Buffer.concat(stdout);
        }
        if (stderr.length > 0) {
          stdio.stderr = Buffer.concat(stderr);
        }
        const err = new RunScriptTimeoutError(
          `Run "${sh} ${shFlag} ${script}" timeout in ${extraOptions.timeout}ms`, stdio, timeout);
        return reject(err);
      }, timeout);
    }
  });
}

export const runscript = runScript;
