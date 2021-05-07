import * as runscript from '../../../';
import assert = require('assert');

runscript('node -v', { stdio: 'pipe' }, { timeout: 30000 })
  .then(result => {
    assert(!result.stderr);
    assert(!!result.stdout!.toString());
    console.info(result.stdout!.toString());

    return runscript('node -h', {
      stdio: 'pipe',
      stdout: process.stdout,
      stderr: process.stderr,
    }, {});
  })
  .catch((err: runscript.StdError) => {
    assert(err.stdio);
    throw new Error('should not throw');
  });
