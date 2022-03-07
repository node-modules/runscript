'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const runScript = require('..');

describe('runscript.test.js', () => {
  it('should run `$ node -v`', () => {
    return runScript('node -v');
  });

  it('should run `$ npm -v`', () => {
    return runScript('npm -v');
  });

  it('should run `$ echo "hello"`', () => {
    return runScript('echo "hello"');
  });

  it('should reject on exit code < 0', () => {
    return runScript('node -e "process.exit(-1)"')
      .catch(err => {
        console.log(err);
        assert(err.name === 'RunScriptError');
        // node 10 on windows -1 equal to 4294967295
        assert(err.exitcode === 255 || err.exitcode === 4294967295);
      });
  });

  it('should reject on exit code = 1', () => {
    return runScript('node -e "process.exit(1)"')
      .catch(err => {
        console.log(err);
        assert(err.name === 'RunScriptError');
        assert(err.exitcode === 1);
      });
  });

  it('should reject on cmd not exists', () => {
    return runScript('node-not-exists -e "process.exit(-1)"', {
      shell: true,
      stdio: 'pipe',
    })
      .catch(err => {
        console.log(err);
        assert(err.name === 'RunScriptError');
      });
  });

  it('should reject on timeout (stdout)', () => {
    return runScript(`node ${path.join(__dirname, 'fixtures/timeout.js')}`, {
      stdio: 'pipe',
    }, { timeout: 1200 })
      .catch(err => {
        console.log(err);
        assert(err.name === 'RunScriptTimeoutError');
        assert(err.stdio.stdout.toString() === 'timer start\necho every 500ms\necho every 500ms\n');
      });
  });

  it('should reject on timeout (stderr)', () => {
    return runScript(`node ${path.join(__dirname, 'fixtures/timeout-stderr.js')}`, {
      stdio: 'pipe',
    }, { timeout: 1500 })
      .catch(err => {
        console.log(err);
        assert(err.name === 'RunScriptTimeoutError');
        assert(err.stdio.stderr.toString() === 'timer start\necho every 600ms\necho every 600ms\n');
      });
  });

  it('should normal exit before timeout', () => {
    return runScript(`node ${path.join(__dirname, 'fixtures/timeout-and-exit.js')}`, {
      stdio: 'pipe',
    }, { timeout: 1800 })
      .then(stdio => {
        assert(stdio.stderr.toString() === 'timer start\necho every 600ms\necho every 600ms\nexit\n');
      });
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

  it('should run relative path ./node_modules/.bin/autod', () => {
    return runScript('./node_modules/.bin/autod -V', {
      stdio: 'pipe',
    }).then(stdio => {
      // console.log(stdio.stdout.toString());
      assert(/^\d+\.\d+\.\d+$/.test(stdio.stdout.toString().trim()));
      assert.equal(stdio.stderr, null);
    });
  });

  it('should run relative path ../../node_modules/.bin/autod', () => {
    return runScript('../../node_modules/.bin/autod -V', {
      stdio: 'pipe',
      cwd: path.join(__dirname, 'fixtures'),
    }).then(stdio => {
      // console.log(stdio.stdout.toString());
      assert(/^\d+\.\d+\.\d+$/.test(stdio.stdout.toString().trim()));
      assert.equal(stdio.stderr, null);
    });
  });

  it.only('should exit when child process has not closed stdio streams', () => {
    return runScript(`node ${path.join(__dirname, 'fixtures/child-process-with-unclosed-stdio.js')}`, {
      stdio: 'pipe',
    }).then(stdio => {
      assert(/child finish/.test(stdio.stdout.toString().trim()));
    });
  });

  if (process.platform === 'win32') {
    it('should run relative path .\\node_modules\\.bin\\autod', () => {
      return runScript('.\\node_modules\\.bin\\autod -V', {
        stdio: 'pipe',
      }).then(stdio => {
        // console.log(stdio.stdout.toString());
        assert(/^\d+\.\d+\.\d+$/.test(stdio.stdout.toString().trim()));
        assert.equal(stdio.stderr, null);
      });
    });

    it('should run relative path ..\\..\\node_modules\\.bin\\autod', () => {
      return runScript('..\\..\\node_modules\\.bin\\autod -V', {
        stdio: 'pipe',
        cwd: path.join(__dirname, 'fixtures'),
      }).then(stdio => {
        // console.log(stdio.stdout.toString());
        assert(/^\d+\.\d+\.\d+$/.test(stdio.stdout.toString().trim()));
        assert.equal(stdio.stderr, null);
      });
    });
  }
});
