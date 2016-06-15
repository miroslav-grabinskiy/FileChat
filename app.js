var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var ROOT = __dirname + "/public";

var filePath = 'file23a23.txt';

new http.Server(function(req, res) {
	if (req.url == '/file' && req.method == 'POST') {
		req.on('data', function (chunk) {

			fs.stat(filePath, function(err, stat) {

				if (err) {
					fs.writeFile(filePath, '', 'utf-8', function() {
						sendAndWriteFile(req, res, chunk);
					});
				} else {
					sendAndWriteFile(req, res, chunk);
				}

			});
		});
	}
}).listen(9020);

function sendAndWriteFile(req, res, chunk) {
	var writeFile = function() {
		var writable = new fs.WriteStream('file.txt');
		writable.write(chunk, 'utf8');
		writable.on('finish', function() {
			writable.destroy();
		});
		writable.on('error', function (err) {
		    writable.destroy();
		    return console.error(err);
		});
	}


	fs.stat('/' + filePath, function(err, stats) {
		if (err) {
			fs.writeFile(filePath, '', function (err) {
				if (err) return console.error(err);
				readFile();
			});
		} else {
			readFile();
		}

	});

	var readFile = function () {
		var readable = new fs.ReadStream('file.txt');
		readable.pipe(res);

		readable.on('error', function(err) {
			res.statusCode = 500;
			console.error(err);
			res.end('Internal Server Error');
		});

		readable.on('close', function() {
			readable.destroy();
			writeFile();
		});

		res.on('close', function() {
			readable.destroy();
			writeFile();
		});
	}

};

console.log('start app');
