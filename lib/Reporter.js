var sty = require('sty');
var helper = require('./helper');

function Reporter(options){
  var options = options || {};

  this._runner = options.runner;
  this._lastLine = null;
  this._totalNum = 0;
  this._failed = 0;
  this._passed = 0;
  this._progress = 0;
  this._started = null;

  this._runner.on('start', this._start.bind(this));
  this._runner.on('fileComplete', this._fileComplete.bind(this));
  this._runner.on('complete', this._end.bind(this));
}

Reporter.prototype._start = function(files){
  var self = this;
  this._started = Date.now();
  this._totalNum = files.length;
  this.updateStatus();
  this._interval = setInterval(function(){
    self.updateStatus();
  }, 1000);
}

Reporter.prototype._fileComplete = function(err, file, output){
  if( err ) {
    this._failed++;

    console.log(sty.yellow('\n' + 'node ' + file + '\n' + helper.strRepeat('=', file.length + 5)));
    output.forEach(function(line){ // Write each line from the child process
      console.log(sty.bold(line.data));
    });
  } else {
    this._passed++;
  }
  this._progress++;
  this.updateStatus();
}

Reporter.prototype._end = function(data){
  var self = this;
  clearInterval(this._interval);
  this._runner.setTime(this.timeTaken());
  var code = ( this._failed > 0 || data.code > 0 ) ? 1 : 0;

  var out = '\n';

  if( code > 0 && data.message != '' ){
    out += sty.red(data.message) + '\n';
  }

  process.stdout.write(out);
  process.stdout.once('drain', function(){
    if( self._runner._cb === null){
      process.exit(code);
    }
  });
}

Reporter.prototype.clearLine = function() {
  if (!this._lastLine) return;

  var spaces = helper.strRepeat(' ', this._lastLine.length);

  process.stdout.write('\r' + spaces + '\r');
};

Reporter.prototype.updateStatus = function() {
  var lineout = '\r~ ' + this.timeTaken() + ' ' + this._failed + ' ' + this.getProgress() + ' ~';
  if( this._failed > 0 ){
    lineout = sty.red(lineout);
  }
  this.clearLine();
  process.stdout.write(lineout);
  this._lastLine = lineout;
};

Reporter.prototype.timeTaken = function(){
  var diff = new Date - this._started;

  var seconds = Math.floor((diff) / 1000); // Milliseconds to seconds
  var minutes = Math.floor(seconds / 60); // Seconds to minutes
  var hours = Math.floor(minutes / 60); // Minutes to hours

  // Get the remainder from 60 so we don't get higher than that!
  seconds = seconds % 60;
  minutes = minutes % 60;

  // Pad with zeroes
  seconds = seconds < 10 ? '0' + seconds : seconds;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  hours   = hours < 10 ? '0' + hours : hours;


  return hours + ':' + minutes + ':' + seconds;
}

Reporter.prototype.getProgress = function(){
  if( this._totalNum < 1 ){
    return '0/0 0%';
  }

  var percent = ( (this._progress / this._totalNum) * 100 ).toFixed(1);

  return this._progress + '/' + this._totalNum + ' ' + percent + '%' + this.getProgressBar(percent);
}

Reporter.prototype.getProgressBar = function (percent) {
  if(!this._runner._options.progressBar) return '';
  var chunks = Math.floor(percent / 5);
  return ' [' + helper.strRepeat('=', chunks - 1) + '>' + helper.strRepeat('-', 20 - chunks) + ']';
}

module.exports = Reporter;