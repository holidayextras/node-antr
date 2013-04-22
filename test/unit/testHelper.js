var helper = require('../../lib/helper');
var assert = require('assert');
var _ = require('underscore');

(function(){
  helper.walk('test/files', function(err, files){
    var testFiles = [
      'test/files/dontRunMe.js',
      'test/files/file.js',
      'test/files/runMe.js'
    ];

    var difference = _.difference(testFiles, files);
    assert.deepEqual(difference, []);
  });

})();

(function(){
  var dumStr = '1111111111';
  var repStr = helper.strRepeat('1', 10);
  assert.equal(dumStr, repStr);
  assert.equal(repStr.length, 10);
})();