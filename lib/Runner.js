var async = require('async');
var fs = require('fs');
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

util.inherits(Antr, EventEmitter);

function Antr (options, cb) {
  var self = this;
  this._cb = cb || null;

  this._options =  {
    dirname: options.dirname || '',
    filter: options.filter || /^(?!\.)(.+)\.js$/,
    batchSize: options.batchSize || 8,
    timeout: (isNaN(parseInt(options.timeout)) )? 30000 : parseInt(options.timeout) * 1000
  }

  this._stats = {
    fails: 0,
    passes: 0,
    total: 0,
    failRate: 0,
    failedTests: [],
    passedTests: [],
    timeTaken: null
  }
}

Antr.prototype.run = function() {
  var self = this;

  self.getFiles(function (err, files) {
    self.emit('start', files);

    if(files.length == 0) self.emit('complete', {code: 1, message: 'No files found.'});

    var stack = [];
    var complete = [];
    var totalTests = files.length;

    while(stack.length < self._options.batchSize && files.length > 0) {
      var current = files.pop();
      stack.push(current);

      var handle = function (err, data) {
        complete.push(stack.splice(stack.indexOf(data.item), 1)[0]);
        if(complete.length == totalTests) {
          self.emit('complete', {code: 0, message: 'Tests complete'});
          if(self._cb !== null) {
            setTimeout(function () {
              self._cb(self._stats);
            }, 1000);
          }
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

  var timeout = setTimeout(function () {
    storedData.push({type: 'timeout', data: 'ERROR: No response received after ' + (self._options.timeout / 1000) + ' seconds.'});
    callback(null, {item: item, code: 1, data: storedData});
    self.emit('fileComplete', 1, item, storedData);
  }, this._options.timeout);


  runTest.stdout.setEncoding('utf8');
  runTest.stdout.on('data', function (data) {
    storedData.push({type: 'stdout', data: data});
  });

  runTest.stderr.setEncoding('utf8');
  runTest.stderr.on('data', function (data) {
    storedData.push({type: 'stderr', data: data});
  });

  runTest.on('exit', function (code) {
    var data = { item: item, code: code, data: storedData };
    callback(null, data);
    self.updateStats(data);
    self.emit('fileComplete', code, item, storedData);
    clearTimeout(timeout);
  });
}

Antr.prototype.updateStats = function(data) {
  console.log(data);
  if(!data) return;
  if(data.code == 0) {
    this._stats.passes = this._stats.passes + 1;
    this._stats.passedTests.push(data.item);
  } else {
    this._stats.fails = this._stats.fails + 1;
    this._stats.failedTests.push(data.item);
  }
  this._stats.total = this._stats.total + 1;
  this._stats.failRate = this._stats.fails / this._stats.total * 100
}

Antr.prototype.setTime = function(value) {
  this._stats.timeTaken = value;
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