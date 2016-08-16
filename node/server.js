var http = require('http');
var url = require('url');
var formidable = require("formidable");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var postData = '';
        request.setEncoding('utf8');
        request.addListener('data', function(data) {
        	postData += data;
        });
        request.addListener('end', function() {
            route(response, pathname, handle, postData);
        });
    }
    http.createServer(onRequest).listen(8888);
}
exports.start = start;