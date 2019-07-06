'use strict';

console.error('timer start');
setInterval(() => {
  console.error('echo every 500ms');
}, 500);

setTimeout(() => {
  console.error('exit');
  process.exit(0);
}, 1100);
