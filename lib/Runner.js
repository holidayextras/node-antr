var async = require('async');
var fs = require('fs');
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

util.inherits(Antr, EventEmitter);

function Antr (options, cb) {
  var self = this;
  this._cb = cb || function () {};

  this._options =  {
    dirname: options.dirname || '',
    filter: options.filter || /^(?!\.)(.+)\.js$/,
    batchSize: options.batchSize || 8
  }
}

Antr.prototype.run = function() {
  var self = this;

  self.getFiles(function (err, files) {
    self.emit('start', files);

    if(files.length == 0) self.emit('complete');

    var stack = [];
    var complete = [];
    var totalTests = files.length;

    while(stack.length < self._options.batchSize && files.length > 0) {
      var current = files.pop();
      stack.push(current);

      var handle = function (err, data) {
        complete.push(stack.splice(stack.indexOf(data.item), 1)[0]);
        if(complete.length == totalTests) {
          self.emit('complete');
        } else {
          var current = files.pop();
          if(typeof current !== 'undefined') {
            stack.push(current);
            self.runSingleTest(current, self, handle);
          }
        }
      }
      self.runSingleTest(current, self, handle);
    }
  });
}

Antr.prototype.runSingleTest = function(item, self, callback){
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
    callback(null, { item: item, code: code, data: storedData });
    self.emit('fileComplete', code, item, storedData);
  });
}

Antr.prototype.getFiles = function (cb) {
  var self = this;
  fs.readdir(self._options.dirname, function (err, files) {
    if(err) return self._cb('Not a valid dir');
    
    async.filter(files, function (item, callback) {
      callback(self._options.filter.test(item));
    }, function (filteredFiles) {
      cb(null, filteredFiles);
    });
  });
}


module.exports = Antr;