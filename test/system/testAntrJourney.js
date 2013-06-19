var Antr = require('../../');
var assert = require('assert');
var _ = require('underscore');

var path = __dirname + '/../dummyTests';

var run = new Antr({
  filter: /(dummy.+)\.js/,
  dirname: path,
  timeout: 5,
  batchSize: 6
}, function (err, stats) {
  assert.equal(3, stats.failed);
  assert.equal(3, stats.passed);
  assert.equal(6, stats.total);
  var diff = _.difference([ path + '/dummy2.js', path + '/dummy4.js', path + '/dummy6.js' ], stats.failedTests);
  assert.deepEqual([], diff);
  // If we've made it this far we have passed our tests...
  process.exit(0);
});