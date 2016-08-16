var server = require('./server.js');
var router = require('./router.js');
var requestHandler = require('./requestHandlers');

var handle = {};
handle['/'] = requestHandler.start;
handle['/start'] = requestHandler.start;
handle['/upload'] = requestHandler.upload;
server.start(router.route, handle);