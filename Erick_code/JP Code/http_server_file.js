/**
 * Created by ebeljea on 10/24/16.
 */


var http = require('http');
var fs = require("fs");

const PORT=8080;

function handleRequest(request, response){
    console.log("url is " + request.url)
    fs.readFile(request.url,  function(err, block) {
        if ( ! err ) {
            response.end(block.toString())
        }
    });
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});