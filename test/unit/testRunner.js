var Runner = require('../../lib/Runner.js');
var assert = require('assert');
var sinon = require('sinon');

(function () {
  var runner = new Runner({
    dirname: ['test/unit', 'test/files'],
    filter: /run([^\/w]+?)\.js$/
  });

  // Test the stats when a test passes
  var data = {
    code: 0,
    item: 'testPass.js'
  };
  runner.updateStats(data);

  // Test the stats when a test fails
  var data = {
    code: 1,
    item: 'testFail.js'
  };
  runner.updateStats(data);

  // Test the updating of time taken works
  runner.setTime(10);

  // Test the file finder and filter is working properly
  runner.getFiles(function(err, files){
    var testFiles = [
      'test/files/runMe.js'
     ];
    assert.deepEqual(files, testFiles);
  });

  runner._options.dirname = 'test/files'; // Change to using a non array of directories
  // Test the file finder and filter is working properly
  runner.getFiles(function(err, files){
    var testFiles = [
      'test/files/runMe.js'
     ];
    assert.deepEqual(files, testFiles);
  });

  // Do the assertions!
  assert.equal(runner._stats.passed, 1);
  assert.equal(runner._stats.failed, 1);
  assert.equal(runner._stats.total,2);
  assert.equal(runner._stats.failRate, 50);
  assert.equal(runner._stats.timeTaken, 10);

})();

(function() {
  var runner = new Runner({
    dirname: ['test/files', 'test/sorting'],
    filter: /run([^\/w]+?)\.js$/,
    listFiles: true,
    sort: function(leftPath, rightPath) {
      var leftFilename = leftPath.split('/').slice(-1)[0];
      var rightFilename = rightPath.split('/').slice(-1)[0];
      return (leftFilename > rightFilename) ? 1 : -1;
    }
  });
  sinon.spy(console, 'log');

  runner.getFiles(function(err, files){

    var expectedPaths = [
      'test/sorting/runAlpha.js',
      'test/sorting/runBeta.js',
      'test/files/runMe.js',
      'test/sorting/runZeta.js'
    ];

    assert.deepEqual(files, expectedPaths);
    assert.ok(console.log.calledWith('Files going to be run: ', expectedPaths));
    console.log.restore();
  });
})();
