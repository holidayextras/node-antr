var fs = require('fs');

module.exports = {
  walk: function(dir, done) {
    var self = this;
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            self.walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  },
  strRepeat: function(str, length){
    var out = '';
    for( var x=0; x<length; x++){
      out += str;
    }
    return out;
  },
  concatArray: function (arrays) { // res == array of array
    for(var a in arrays) {
      if (a == 0) {
        var arr = arrays[a];
      } else {
        arr = arr.concat(arrays[a])
      }
    }
    return arr;
  }
}