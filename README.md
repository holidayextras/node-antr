#antr

Asynchronous Node Test Runner

##Why?
We had the need for a runner which runs tests asynchronously.

##Install
	npm install antr
	
##Usage
Just require the module and you're away!

	var Antr = require('antr');

	var run = new Antr({
  		dirname: __dirname,
  		filter: /test([^\/w]+?)\.js$/
	});

You can pass a callback in as the second parameter if you like, which will callback with err, stats. If you don't give antr a callback it will quit the process for you.
	
	var Antr = require('antr');
	
	var run = new Antr({
		dirname: __dirname,
		filter: /test([^\/w]+?)\.js$/
	}, function(err, stats){
		console.log('Tests failed: ', stats.fails);
	});
	
### Options

#### Required
* **filter** Regex to filter files to run

##### Optional
* **dirname** Directory to find files in - defaults to `.`
* **listFiles** Print out the array of files which will be run - defaults to `false`
* **timeout** A timeout, in seconds, for each test - defaults to `30`
* **batchSize** Maximum amount of concurrent tests to run - defaults to `8`

## npm Maintainers
* [Joe Warren](http://www.github.com/joewarren)
* [Jack Cannon](http://www.github.com/jackcannon)

## License
antr is licensed under the MIT license.
