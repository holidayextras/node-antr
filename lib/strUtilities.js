module.exports = {
  repeat: function(str, length){
    var out = '';
    for( var x=0; x<length; x++){
      out += str;
    }
    return out;
  }
}