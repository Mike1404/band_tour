/**
 * Created by mike on 19/12/16.
 */

var fs = require('fs');

function handleFile(request, response) {

    if (! request.url.match(/^.*\..*$/)) {
        return false;
    }

    var extension = request.url.split(".")[1];
    var types = {
        "html": "text/html",
        "jpg": "image/jpeg",
        "gif": "image/gif"
    };

    var mimeType = types[extension];
    if ( mimeType != undefined) {

        response.setHeader('Content-Type', mimeType);
    }

    fs.readFile( __dirname + request.url, function (err, data) {
        if (err) {
            response.statusCode = 404;
            response.end();
            return true;
        }

        response.statusCode = 200;
        response.end(data);
        return true;
    });
    return true;
}
