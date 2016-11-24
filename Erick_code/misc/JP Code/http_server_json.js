/**
 * Created by ebeljea on 10/24/16.
 */


var http = require('http');
var fs = require("fs");

const PORT = 8080;

function handleRequest(request, response) {
    console.log("url is " + request.url);
    fs.readFile(request.url, function (err, block) {
        if (!err) {
            var data = {
                "name": request.url,
                "data": block.toString()
            };
            response.setHeader("Content-type", "application/json");
            response.end(JSON.stringify(data));
        } else {
            response.statusCode = 404;
            response.end();
        }
    });
}

var server = http.createServer(handleRequest);

server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});