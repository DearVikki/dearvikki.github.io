function route(response, pathname, handle, postData) {
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, postData);
    } else {
    	response.write('no request found');
    	response.end();
    }
};
exports.route = route;