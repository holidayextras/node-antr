var Reporter = require('./lib/Reporter');
var Runner = require('./lib/Runner');

module.exports = function(options, cb) {
  var runner = new Runner(options, cb);
  var reporter = new Reporter({runner: runner});
  runner.run();
}