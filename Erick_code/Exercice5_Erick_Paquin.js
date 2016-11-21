/**
 * Created by erickp on 21/11/16.
 */

var http = require('http');

const PORT = 8080;

function handleRequest(request, response) {

    var url = request.url;
    var item_requested = url.split("/")[1];


    if (item_requested == "date") {
        var thedate = new Date();
        response.statusCode = 200;
        response.write(thedate.toDateString());
        response.end();
    } else if (item_requested == "time") {
        var thetime = new Date();
        response.statusCode = 200;
        response.write(thetime.toTimeString());
        response.end();
    } else {
        response.statusCode = 404;
        response.write("404 NOT FOUND!!");
        response.end();
    }


}

var server = http.createServer(handleRequest);

server.listen(PORT, function () {

    console.log("Server listening on: http://localhost:%s", PORT);
});