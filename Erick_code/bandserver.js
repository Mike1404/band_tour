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

function ok200(response, rows) {
    response.statusCode = 200;
    response.end("OK Man!!");
}

function ok201(response, rows, fields) {
    response.statusCode = 201;
    response.end("Created, Bro!");
}

function fail400(response) {
    response.statusCode = 400;
    response.end("BAD REQUEST!!");
}

function handleRequest(request, response) {

    // grab url parameters

    if (request.url == "/favicon.ico") {
        fail404(response);
        return;
    }

    var url = request.url;
    var table = url.split("/")[1];
    var param1 = url.split("/")[2];
    var param2 = url.split("/")[3];
    var param3 = url.split("/")[4];
    var param4 = url.split("/")[5];

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

            connection.query(
                {
                    sql: sqlRequest,
                    values: [param1]
                },
                function (err, rows) {
                    if (err) {
                        console.log(sqlRequest);
                        throw err;
                        fail404(response);
                    }

                    ok200(response, rows);
                    console.log(sqlRequest);

                }
            );

        });


    } else if (request.method == "PUT") { // ??? 1er = colonne, 2iem = valeur de remplacement, 3iem = Reference unique
        var putreq = {
            "band": "update band set band_name = ? where band_name = ?",
            "city": "update city set city_name = ? where city_name = ?",
            "finances_spendings": "update finances set spendings = ? where band_id = ? && tour_date_id = ? ",
            "finances_revenues": "update finances set revenues = ? where band_id = ? && tour_date_id = ?"
        };

        connection.connect(function (err) {

            var sqlRequest = putreq[table];
            console.log(sqlRequest);
            connection.query(
                {
                    sql: sqlRequest,
                    values: [param1, param2, param3]
                },
                function (err, rows) {
                    if (err) {
                        console.log(sqlRequest);
                        throw err;
                        fail404(response);
                    }

                    ok200(response, rows);
                    console.log(sqlRequest);

                }
            );

        });

    } else if (request.method == "POST") { // ??? 1er = colonne, 2iem = valeur de remplacement, 3iem = Reference unique
        var postreq = {
            "band": "insert into band values(null, ?, null)",
            "city": "insert into city values(null, ?, ?)",
            "finances": "insert into finances values(null, ?,?,?,?)"
        };

        connection.connect(function (err) {

            var sqlRequest = postreq[table];
            console.log(sqlRequest);
            connection.query(
                {
                    sql: sqlRequest,
                    values: [param1, param2, param3, param4]
                },
                function (err, rows, fields) {
                    if (err) {
                        console.log(sqlRequest);
                        throw err;
                        fail404(response);
                    }
                    ok201(response, rows, fields);
                    console.log(sqlRequest);
                }
            );

        });

    } else if (request.method == "DELETE") {


        if (table == "band") {

            connection.query(
                "delete from finances where band_id = (select id from band where band_name = ?)",
                [param1],
                function (err, rows) {
                    if (err) {
                        //console.log(sqlRequest);
                        throw err;
                        // fail404(response);
                    }

                    connection.query("delete from band where band_name = ?", [param1], function (err, rows) {
                        ok200(response, rows);
                        // server.close();
                        // process.exit(0);
                    });
                });

        }

        else if (table === "city") {

            connection.query(
                "delete from finances where tour_date_id = (select id from city where city_name = ?)",
                [param1],
                function (err, rows) {
                    if (err) {
                        //console.log(sqlRequest);
                        throw err;
                        // fail404(response);
                    }

                    connection.query("delete from city where city_name = ?", [param1], function (err, rows) {
                        ok200(response, rows);
                        // server.close();
                        // process.exit(0);
                    });
                });

        } else {
            var delreq = {
                "finances_band": "delete from finances where band_id = ?",
                "finances_city": "delete from finances where tour_date_id = ?",
                "finances_band_city": "delete from finances where band_id = ? and tour_date_id = ?"
            };

            connection.connect(function (err) {

                var sqlRequest = delreq[table];
                console.log(sqlRequest);
                connection.query(
                    {
                        sql: sqlRequest,
                        values: [param1, param2]
                    },
                    function (err, rows) {
                        if (err) {
                            console.log(sqlRequest);
                            throw err;
                            fail404(response);
                        }
                        ok200(response, rows);
                        console.log(sqlRequest);
                    }
                );

            });
        }

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