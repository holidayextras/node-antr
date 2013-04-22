var helper = require('../../lib/helper');
var assert = require('assert');
var _ = require('underscore');

(function(){ // test walk helper function
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

(function(){ // test strRepeat helper function
  var dumStr = '1111111111';
  var repStr = helper.strRepeat('1', 10);
  assert.equal(dumStr, repStr);
  assert.equal(repStr.length, 10);
})();

(function() { // test concatArray helper function
  var before = [
    [ 0, 1, 2, 3 ],
    [ 4, 5, 6, 7 ],
    [ 8, 9, 10, 11 ],
    [ 12, 13, 14, 15 ]
  ];
  var after = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];
  assert.deepEqual(helper.concatArray(before), after);

  assert.deepEqual(helper.concatArray([0, 1, 2]), [0, 1, 2]);

  assert.deepEqual(helper.concatArray([[0, 1, 2]]), [0, 1, 2]);
})();