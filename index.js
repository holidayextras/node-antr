var async = require('async');
var fs = require('fs');
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

util.inherits(jRun, EventEmitter);

function jRun (options, cb) {
  var self = this;
  this._cb = cb || function () {};

  this._options =  {
    dirname: options.dirname || '',
    filter: options.filter || /^(?!\.)(.+)\.js$/
  }
}

jRun.prototype.run = function() {
  var self = this;

  fs.readdir(self._options.dirname, function (err, files) {
    if(err) return self._cb('Not a valid dir');
    
    async.filter(files, function (item, callback) {
      callback(self._options.filter.test(item));
    }, function (filteredFiles) {
      
      self.emit('start', filteredFiles);

      async.each(filteredFiles, function(item, callback){
        var runTest = spawn('node', [ self._options.dirname + '/' + item ]);
        var storedData = [];

        runTest.stdout.setEncoding('utf8');
        runTest.stdout.on('data', function (data) {
          storedData.push({type: 'stdout', data: data});
        });

        runTest.stderr.setEncoding('utf8');
        runTest.stderr.on('data', function (data) {
          storedData.push({type: 'stderr', data: data});
        });
        runTest.on('exit', function (code) {
          callback(null, { code: code, data: storedData });
          self.emit('fileComplete', code, item, storedData);
        });
      },
      function(err, results){
        self._cb(err, results);
        self.emit('complete');
      });
    });
  });

  // async.each(Object.keys(tests), function(item, callback){
  //   var test = new tests[item]();
  //   test.runTests(callback);
  // },
  // function(err, results){
  //   cb(err, results);
  //   if(err) {
  //     process.exit(1);
  //   } else {
  //     process.exit(0);
  //   }
  // });
}


module.exports = jRun;