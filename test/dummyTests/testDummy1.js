(function () {
  setTimeout(function () {
    var a = 2 + 2;
    if(a != 4) {
      throw new Error('Dummy 1 failed');
    }
  }, 3000);
})();