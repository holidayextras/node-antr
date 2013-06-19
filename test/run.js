var antr = require('../');

var run = new antr({
  dirname: __dirname,
  filter: /test([^\/w]+?)\.js$/,
  timeout: 10
});