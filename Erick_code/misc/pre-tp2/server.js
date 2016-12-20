/**
 * Created by erickp et Michael Gabriel on 21/11/16.
 **/

var http = require('http');
var fs = require('fs');

const PORT = 8080;
var pagenum = 0;


function fail400(response) {
    response.statusCode = 400;
    response.end("BAD REQUEST!!");
}

function handleFile(request, response) {
    if(request.url == "/prev"){
        pagenum--;
    }
    if(request.url == "/next"){
        pagenum++;
    }

    // var url = request.url;
    // var dapage = url.split("/")[1];

    if(pagenum < 0) {
        var page = "404.html";
        fs.readFile(page, function (err, page) {
            if (!err) {
                response.statusCode = 200;
                response.end(page);
            }
        });
    } else if(pagenum > 0) {
        var page = pagenum+".html";
        fs.readFile(page, function (err, page) {
            if (!err) {
                response.statusCode = 200;
                response.end(page);
            }
        });
    } else {
        fs.readFile("index.html", function (err, indexfile) {
            if (!err) {
                response.statusCode = 200;
                response.end(indexfile);
            }
        });
    }
    return true;
}

var server = http.createServer(handleFile);

server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});
