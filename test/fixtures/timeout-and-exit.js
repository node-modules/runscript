'use strict';

console.error('timer start');
setInterval(() => {
  console.error('echo every 600ms');
}, 600);

setTimeout(() => {
  console.error('exit');
  process.exit(0);
}, 1500);
