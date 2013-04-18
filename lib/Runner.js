var async = require('async');
var fs = require('fs');
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var helper = require('./helper.js');

util.inherits(Antr, EventEmitter);

function Antr (options, cb) {
  var self = this;
  this._cb = cb || null;

  options = options || {};
  this._options =  {
    dirname: options.dirname || '.',
    filter: options.filter || /^(?!\.)(.+)\.js$/,
    batchSize: options.batchSize || 8,
    timeout: (isNaN(parseInt(options.timeout)) )? 30000 : parseInt(options.timeout) * 1000,
    listFiles: options.listFiles || false
  }
  this._stats = {
    failed: 0,
    passed: 0,
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
    if(files && files.length == 0 || !files) {
      self.emit('complete', {code: 1, message: 'No files found.'});
      if (self._cb !== null) self._cb('ERROR: No files found.', self._stats);
    } else {
      self.emit('start', files);

      var stack = [];
      var complete = [];
      var totalTests = files.length;

      async.eachLimit(files, self._options.batchSize, function (item, cb) {
        self.runSingleTest(item, self, cb);
      }, function (err) {
        self.emit('complete', {code: 0, message: ''});
        if (self._cb !== null) {
          if(self._stats.failed == 0) {
            self._cb(null, self._stats);
          } else {
            self._cb('ERROR: ' + self._stats.failed + ' tests failed.', self._stats);
          }
        }
      })
    }
  });
}

Antr.prototype.runSingleTest = function(item, self, callback){
  var runTest = spawn('node', [ item ]);
  var storedData = [];

  var timeout = setTimeout(function () {
    storedData.push({type: 'timeout', data: 'ERROR: No response received from test after ' + (self._options.timeout / 1000) + ' seconds.'});
    self.emit('fileComplete', 1, item, storedData);
    callback(null, {item: item, code: 1, data: storedData});
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
    self.updateStats(data);
    self.emit('fileComplete', code, item, storedData);
    callback(null, data);
    clearTimeout(timeout);
  });
}

Antr.prototype.updateStats = function(data) {
  if(!data) return;
  if(data.code == 0) {
    this._stats.passed++;
    this._stats.passedTests.push(data.item);
  } else {
    this._stats.failed++;
    this._stats.failedTests.push(data.item);
  }
  this._stats.total++;
  this._stats.failRate = (this._stats.failed / this._stats.total).toFixed(1) * 100;
}

Antr.prototype.setTime = function(value) {
  this._stats.timeTaken = value;
}

Antr.prototype.getFiles = function (cb) {
  var self = this;
  helper.walk(this._options.dirname, function (err, files) {
    if( err ) return cb(err, null);
    async.filter(files, function (item, callback) {
      var split = item.split('/');
      callback(self._options.filter.test(split[split.length - 1]));
    }, function (filteredFiles) {
      if( self._options.listFiles ) console.log('Files going to be run: ', filteredFiles);
      cb(null, filteredFiles);
    });
  });
}


module.exports = Antr;