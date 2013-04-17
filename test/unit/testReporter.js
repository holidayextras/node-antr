var Runner = require('../../lib/Runner.js');
var Reporter = require('../../lib/Reporter.js');
var assert = require('assert');

(function () {
  var runner = new Runner({
    dirname: 'test/files',
    filter: /run([^\/w]+?)\.js$/
  });

  var reporter = new Reporter({runner: runner});
  reporter._totalNum = 10;
  reporter._progress = 5;

  var progress = reporter.getProgress();
  assert.equal('5/10 50.0%', progress)
})();