var antr = require('../');

var run = new antr({
  dirname: __dirname,
  filter: /((test).+)\.js$/,
  batchSize: 1,
  timeout: 15
}, function (stats) {
  console.log(stats);
});