var Antr = require('../../');
var assert = require('assert');
var _ = require('underscore');

var path = __dirname + '/../dummyTests';

var run = new Antr({
  filter: /(dummy(?!2|4|6).+)\.js/,
  dirname: path,
  timeout: 5,
  batchSize: 5
});