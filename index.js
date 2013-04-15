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

  self.getFiles(function (err, files) {
    self.emit('start', files);
    async.map(files, function(item, callback){
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

      if(results.code) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  })
}

jRun.prototype.getFiles = function (cb) {
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


module.exports = jRun;