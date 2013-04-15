function Reporter(options){
  var options = options || {};
  var self = this;

  this._runner = options.runner;
  this._lastLine = null;
  this._totalNum = 0;
  this._failed = 0;
  this._passed = 0;
  this._progress = 0;
  this._started = null;

  this._runner.on('start', self._start.bind(this));
  this._runner.on('fileComplete', self._fileComplete.bind(this));
  this._runner.on('complete', self._end.bind(this));
}

Reporter.prototype._start = function(files){
  this._started = Date.now();
  this._totalNum = files.length;
}

Reporter.prototype._fileComplete = function(err, file, output){
  if( err ) {
    this._failed++;
    process.stdout.write('\n' + file + '\n' + output.data);
  } else {
    this._passed++;
  }
  this._progress++;
}

Reporter.prototype._end = function(){
  if( this._failed > 0 ){
    process.exit(1);
  } else {
    this.updateStatus();
    process.exit(0);
  }
}

Reporter.prototype.clearLine = function() {
  if (!this._lastLine) return;

  var spaces = ' ';
  for(i in this._lastLine.length){
    spaces += ' ';
  }

  process.stdout.write('\r' + spaces + '\r');
};

Reporter.prototype.updateStatus = function() {
  var lineout = '\r ' + this.timeTaken() + ' ' + this._failed + ' ' + this.getProgress();

  this.clearLine();
  process.stdout.write(lineout);
  this._lastLine = lineout;
};

Reporter.prototype.timeTaken = function(){
  var diff = new Date - this._started;

  var seconds = Math.floor((diff) / 1000); // Milliseconds to seconds
  var minutes = Math.floor(seconds / 60); // Seconds to minutes
  var hours = Math.floor(minutes / 60); // Minutes to hours

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

  var percent = (this._progress / this._totalNum).toFixed(1);

  return this._progress + '/' + this._totalNum + ' ' + percent + '%';
}

Reporter.prototype.run = function(){
  var self = this;
  this._started = Date.now();
  setInterval(function(){
    self.updateStatus();
  },1000);
}

var rep = new Reporter({runner: {on: function(){} } });

rep.run();