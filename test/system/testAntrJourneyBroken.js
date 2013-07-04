var Antr = require('../../');
var assert = require('assert');
var _ = require('underscore');

var path = __dirname + '/../dummyTests';

var run = new Antr({
  filter: /(dummy.+)\.js/,
  dirname: __dirname + '../notarealpath',
  timeout: 5,
  batchSize: 6
}, function (err, stats) {
  console.log(err);
  assert.ok(err);
  assert.equal(err, 'ERROR: No files found.');
  // If we've made it this far we have passed our tests...
  process.exit(0);
});
