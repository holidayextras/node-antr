var str = require('../../lib/strUtilities');
var assert = require('assert');

(function(){
  var dumStr = '1111111111';
  var repStr = str.repeat('1', 10);
  assert.equal(dumStr, repStr);
  assert.equal(repStr.length, 10);
})();