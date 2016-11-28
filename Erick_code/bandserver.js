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

    if (request.url=="/favicon.ico") {
        fail404(response);
        return;
    }

    var url = request.url;
    var table = url.split("/")[1];
    var tableID = url.split("/")[2];
    var tableIDValue1 = url.split("/")[3]; // VALUE1
    var tableIDValue2 = url.split("/")[4]; // VALUE2 FOR NOW

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
            "finances_band": "select * from finances where band_name = ?",
            "finances_city": "select * from finances where city_name = ?"
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
                    if (err) {
                        throw err;
                        fail404(response);
                    }
                    ok200(response);
                    response.end(JSON.stringify(rows));
                }

            );

        });


    } else if (request.method == "PUT") { // ??? 1er = colonne, 2iem = valeur de remplacement, 3iem = Reference unique
        var putreq = {
            "band": "update band set ? = ? where band_name = ?",
            "city": "update city set ? = ? where city_name = ?",
            "finances_band": "update finances set ? = ? where band_name = ?",
            "finances_city": "update finances set ? = ? where city_name = ?"
        };

        connection.connect(function (err) {

            var sqlRequest = putreq[table];
            console.log(sqlRequest);
            connection.query(
                {
                    sql: sqlRequest,
                    values: [tableID, tableIDValue1, tableIDValue2]
                },
                function (err, rows) {
                    if (err) {
                        throw err;
                        fail404(response);
                    }
                    ok200(response);
                    response.end(JSON.stringify(rows));
                }

            );

        });

    } else if (request.method == "POST") { // ??? 1er = colonne, 2iem = valeur de remplacement, 3iem = Reference unique
        var postreq = {
            "band": "insert into band values(null, ?, null)",
            "city": "insert into city values(null, ?, ?)"

            // "finances_city": "select * from finances where city_name = ?"
        };

        connection.connect(function (err) {

            var sqlRequest = postreq[table];
            console.log(sqlRequest);
            connection.query(
                {
                    sql: sqlRequest,
                    values: [tableID]
                },
                function (err, rows) {
                    if (err) {
                        throw err;
                        fail404(response);
                    }
                    ok201(response);
                    response.end(JSON.stringify(rows));
                }

            );

        });

    } else if (request.method == "DELETE") {
        var delreq = {
            "band": "delete from band where band_name = ?",
            "city": "delete from city where city_name = ?",
            "finances_band": "delete from finances where band_name = ?",
            "finances_city": "delete from finances where city_name = ?",
            "finances_band_city": "delete from finances where band_name = ? and city_name = ?"
        };

        connection.connect(function (err) {

            var sqlRequest = delreq[table];
            console.log(sqlRequest);
            connection.query(
                {
                    sql: sqlRequest,
                    values: [tableID, tableIDValue1]
                },
                function (err, rows) {
                    if (err) {
                        throw err;
                        fail404(response);
                    }
                    ok200(response);
                    response.end(JSON.stringify(rows));
                }

            );

        });

    } else {
        // if no method, throw error
        fail400(response);
    }

} // end handlerequest


/////////////////////////////////////////////////////////////////////////
var server = http.createServer(handleRequest); // generate http server

server.listen(PORT, function () { // start listening for requests

    console.log("Server listening on: http://localhost:%s", PORT);
});