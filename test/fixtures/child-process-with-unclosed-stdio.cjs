const path = require('path');
const { runScript } = require('../../');
const argv = process.argv.slice(2);

(async () => {
  if (argv[0] === undefined) {
    runScript(`node ${path.join(__dirname, './child-process-with-unclosed-stdio.cjs')} child`);
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    console.log('child finish');
    process.exit();
  } else if (argv[0] === 'child') {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('grandChild running');
      await new Promise(resolve => {
        setTimeout(resolve, 1000);
      });
    }
  }
})();
