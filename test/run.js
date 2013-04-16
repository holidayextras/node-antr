var antr = require('../');

console.log(__dirname + '/dummyTests');
var run = new antr({
  dirname: __dirname + '/dummyTests',
  filter: /(.+)\.js$/,
  batchSize: 1,
  timeout: 15
}, function (stats) {
  console.log(stats);
});