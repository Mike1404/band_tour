/**
 * Created by Michael Gabriel and Erick Paquin on 16/11/16.
 */



var http = require('http');
var mysql = require('mysql');

const PORT=8080;

function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'tour_manager',
        password: 'abcd',
        database: 'tour_finance'
    });
    connection.connect(function (err) {
        if (err) throw err;

    });
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){

    console.log("Server listening on: http://localhost:%s", PORT);
});
