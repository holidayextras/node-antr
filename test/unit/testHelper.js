var helper = require('../../lib/helper');
var assert = require('assert');

(function(){
  helper.walk('test/files', function(err, files){
    var testFiles = [ 'test/files/dontRunMe.js',
  'test/files/file.js',
  'test/files/runMe.js' ]
    assert.deepEqual(files, testFiles);
  })
})();