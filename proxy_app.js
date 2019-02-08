var express = require("express");
const URL = require('url');
var qs = require('querystring');
var app = express();
const bodyParser = require("body-parser");

app.listen(8000, () => {
	console.log("HTTP Proxy Server running on port 8000");
});

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
	extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

/**
 * This method parses and returns the URL information that we are going to proxy the request.
 * The method supports both http & https URLs.
 */
function getProxyUrl(req) {
	const parsedUrl = URL.parse(req.url, true);
	const path = parsedUrl.pathname;

	// just looking for http text so it will work for both http and https
	var pos = path.indexOf("http");
	var proxyUrl = path.substr(pos, path.length);

	console.log(proxyUrl);
	return proxyUrl;
}

/**
 * This method creates and returns the options object which we need to make an http/https request. 
 * The method supports both http & https URLs.
 */
function getRequestOptions(req) {
	// First of all, we need to get the actual URL information from the request
	var url = getProxyUrl(req);
	const parsedUrl = URL.parse(url, true);

	let options = {
		hostname: parsedUrl.hostname,
		method: req.method,
		protocol: parsedUrl.protocol,
		path: parsedUrl.path,
		headers: req.headers
	};
	// Need to replace the host information on the header object
	options.headers["Host"] = parsedUrl.hostname;
	console.log(options);
	return options;
}

/**
 * This method has a common implementation for all request types like 'GET', 'POST', etc...
 * formData is provided only for POST requests at the moment.
 * The method supports both http & https URLs.
 */
const getContent = function (options, formData) {
	// Return new promise to handle async request
	return new Promise(function (resolve, reject) {
		// Do async job
		// select http or https module, depending on request URL
		const lib = options.protocol.startsWith('https') ? require('https') : require('http');

		var pRequest = lib.request(options, (proxy_res) => {
			const {
				statusCode
			} = proxy_res;
			const contentType = proxy_res.headers['content-type'];

			console.log(options.hostname + ' - Status Code:' + proxy_res.statusCode);

			proxy_res.setEncoding('utf8');
			let rawData = '';
			proxy_res.on('data', (chunk) => {
				rawData += chunk;
			});
			proxy_res.on('end', () => {
				try {
					resolve(rawData);
				} catch (e) {
					reject(e);
				}
			});
		}).on('error', (e) => {
			reject(e);
		});

		if (formData !== null) {
			pRequest.write(qs.stringify(formData));
		}
		pRequest.end();
	});
};

/**
 * HTTP GET implementation for the '/proxy' context on this application.
 */
app.get("/proxy/**", (req, res) => {
	var options = getRequestOptions(req);

	var presp = getContent(options);
	presp.then(function (response) {
		console.log(response);
		res.write(response);
		res.end();
	})
	.catch(function (err) {
		console.error(err);
	});
});

/**
 * HTTP POST implementation for the '/proxy' context on this application.
 */
app.post("/proxy/**", (req, res) => {
	var options = getRequestOptions(req);

	var presp = getContent(options, req.body);
	presp.then(function (response) {
		console.log(response);
		res.write(response);
		res.end();
	})
	.catch(function (err) {
		console.error(err);
	});
});