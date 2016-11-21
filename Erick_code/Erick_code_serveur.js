/**
 * Created by erickp et Michael Gabriel on 21/11/16.
 **/

var http = require('http');
var mysql = require('mysql');

const PORT = 8080;


function fail404(response) {
    response.statusCode = 404;
    response.end("404 NOT FOUND!!")
}

function fail500(response) {
    response.statusCode = 500;
    response.end("SERVER ERROR!!");
}

function ok200(response) {
    response.statusCode = 200;
    response.end("All good, Bro!");
}

function ok201(response) {
    response.statusCode = 201;
    response.end("Created, Bro!");
}

function fail400(response) {
    response.statusCode = 400;
    response.end("BAD REQUEST!!");
}


function handleRequest(request, response) {

    // grab url parameters
    var url = request.url;
    var table = url.split("/")[1];
    var tableID = url.split("/")[2];

    // connect to MySQL
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'tour_manager',
        password: 'abcd',
        database: 'tour_finance'
    });

    if (request.method == "GET") {
        var getreq = {
            "band": "select * from band where band_name = ?",
            "city": "select * from city where city_name = ?",
            "finances": "select * from finances where band_name = ?"
        };

        connection.connect(function (err) {

            var sqlRequest = getreq[table];
            console.log(sqlRequest);
            connection.query(
                {
                    sql: sqlRequest,
                    values: [tableID]
                },
                function (err, rows) {
                    if (err) throw err;
                    response.end(JSON.stringify(rows));

                }
            );

        });


    } else if (request.method == "PUT") {

    } else if (request.method == "POST") {

    } else if (request.method == "DELETE") {

    } else {
        // if no method, throw error
    }

} // end handlerequest


/////////////////////////////////////////////////////////////////////////
var server = http.createServer(handleRequest); // generate http server

server.listen(PORT, function () { // start listening for requests

    console.log("Server listening on: http://localhost:%s", PORT);
});