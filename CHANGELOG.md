# Changelog

## [1.6.0](https://github.com/node-modules/runscript/compare/v1.5.4...v1.6.0) (2024-01-11)


### Features

* drop debug deps ([#22](https://github.com/node-modules/runscript/issues/22)) ([c0231b9](https://github.com/node-modules/runscript/commit/c0231b9e4dcc6d79c7e03de452d5eb56d9364b1f))

## [1.5.4](https://github.com/node-modules/runscript/compare/v1.5.3...v1.5.4) (2024-01-11)


### Bug Fixes

* add check cmd on Windows ([#21](https://github.com/node-modules/runscript/issues/21)) ([ff495d9](https://github.com/node-modules/runscript/commit/ff495d9163a0e655f8aebf1c466021f20ad7274a))

---


1.5.3 / 2022-05-20
==================

**fixes**
  * [[`fe6d304`](http://github.com/node-modules/runscript/commit/fe6d304ab66229f1e58ecac9069e15d9eedc2e04)] - fix: use object.assign instead of object.create (#16) (lusyn <<lusyncat@163.com>>)

**others**
  * [[`0008b4b`](http://github.com/node-modules/runscript/commit/0008b4bbcd32f348dc86eb374615562c63dfe24c)] - 👌 IMPROVE: You should use execa instead (#15) (fengmk2 <<fengmk2@gmail.com>>)

1.5.2 / 2022-03-08
==================

**fixes**
  * [[`475fc7d`](http://github.com/node-modules/runscript/commit/475fc7dcf9e8558875713f4ec016ff251315bcdd)] - fix: Use to exit event instead of close  (#13) (lusyn <<lusyncat@163.com>>)

**others**
  * [[`53f88a2`](http://github.com/node-modules/runscript/commit/53f88a28008049b0c17be8c79a4ea24d9288b0b9)] - 📖 DOC: Add contributors (#14) (fengmk2 <<fengmk2@gmail.com>>)
  * [[`09bb8cd`](http://github.com/node-modules/runscript/commit/09bb8cd38add3ae5b1b1ab46bb090dbcca4ae3b7)] - chore: fix ci badges (fengmk2 <<fengmk2@gmail.com>>)
  * [[`59b76ef`](http://github.com/node-modules/runscript/commit/59b76efac12095417155602fbd39f530cf3f8600)] - test: add more tsd test cases (#12) (fengmk2 <<fengmk2@gmail.com>>)

1.5.1 / 2021-05-07
==================

**fixes**
  * [[`0fd91a4`](http://github.com/node-modules/runscript/commit/0fd91a420da493d1885f7ccd66a6a77394144551)] - fix(interface): Add the missing `extraOpts` paramter in type declaration (#11) (Aaron <<walkthunder@163.com>>)

**others**
  * [[`6fe00d6`](http://github.com/node-modules/runscript/commit/6fe00d69fd91914f7f0a05f18c38fdc1252946fb)] - deps: upgrade dev deps (#10) (fengmk2 <<fengmk2@gmail.com>>)

1.5.0 / 2020-05-22
==================

**features**
  * [[`4d82803`](http://github.com/node-modules/runscript/commit/4d82803172f0a0ef0dd4a5ffecf6e4c44ae63484)] - feat: expose exitcode in error instance (#9) (Otto Mao <<ottomao@gmail.com>>)

1.4.0 / 2019-07-06
==================

**features**
  * [[`a0d7ffb`](http://github.com/node-modules/runscript/commit/a0d7ffb815041baa89b46fb5d76b23f759cd56fb)] - feat: run script with timeout (#8) (fengmk2 <<fengmk2@gmail.com>>)

1.3.1 / 2019-06-15
==================

**fixes**
  * [[`8998c8f`](http://github.com/node-modules/runscript/commit/8998c8f778ce24bb36c653903719fd4ff2189a70)] - fix: add declarations (#7) (吖猩 <<whxaxes@gmail.com>>)

**others**
  * [[`f618799`](http://github.com/node-modules/runscript/commit/f618799676b43ff2ecda94f7e1677b51cacb8af5)] - test: node 10, 12 (#6) (fengmk2 <<fengmk2@gmail.com>>)

1.3.0 / 2017-07-28
==================

  * feat: support relative path on windows (#5)

1.2.1 / 2017-02-22
==================

  * fix: exit code < 0 as error too (#3)

1.2.0 / 2017-02-04
==================

  * feat: add options stdout and stderr (#2)

1.1.0 / 2016-03-06
==================

  * feat: support return stdio

1.0.0 / 2016-02-05
==================

  * First release
