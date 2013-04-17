node-antr
=========

Asynchronous Node Test Runner

### Why?
We had the need for a runner which runs tests asynchronously.

### Install
	npm install antr
	
### Usage
	var antr = require('../');

	var run = new antr({
  		dirname: __dirname,
  		filter: /test([^\/w]+?)\.js$/
	});

### Options
#### Required
* **dirname** Directory to find files in - defaults to `.`
##### Optional
* **filter** Regex to filter files to run
* **listFiles** Print out the array of files which will be run - defaults to `false`
* **timeout** A timeout for each test - default to `30`
* **batchSize** Maximum amount of concurrent tests to run - defaults to `8`