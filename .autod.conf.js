'ues strict';

module.exports = {
  write: true,
  prefix: '^',
  devprefix: '^',
  exclude: [
    'test/fixtures',
    'examples',
    "docs",
  ],
  dep: [
    'is-type-of',
  ],
  devdep: [
    'autod',
    'eslint',
    'eslint-config-egg',
    'egg-bin',
    'egg-ci',
  ],
  test: 'scripts',
};
