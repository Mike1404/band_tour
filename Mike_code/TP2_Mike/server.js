/**
 * Created by erick paquin et Michael Gabriel on 21/11/16.
 **/

var http = require('http');
var mysql = require('mysql');
var fs = require('fs');

const PORT = 8080;

function handleFile(request, response) {

    if (! request.url.match(/^.*\..*$/)) {
        return false;
    }

    var extension = request.url.split(".")[1];
    var types = {
        "html": "text/html",
        "jpg": "image/jpeg",
        "gif": "image/gif",
        "css":"text/stylesheet"
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


function ok200(response) {
    response.statusCode = 200;
    console.log("\nOK Man!!");
}

function ok201(response) {
    response.statusCode = 201;
    console.log("Created, Bro!");
}

function fail400(response) {
    response.statusCode = 400;
    console.log("BAD REQUEST!!");
}

function handleRequest(request, response) {
    if (handleFile(request,response)) {
        return;
    }
    if (request.url == "/favicon.ico") {
        fail400(response);
        return;
    }

    var url = request.url;
    var table = url.split("/")[1];
    var param1 = url.split("/")[2];
    var param2 = url.split("/")[3];
    var param3 = url.split("/")[4];
    var param4 = url.split("/")[5];

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'tour_manager',
        password: 'abcd',
        database: 'tour_finance'
    });

    if (request.method == "GET") {
        var getreq = {
            "band": "select * from band",
            "city": "select * from city",
            "finances": "select * from finances"
        };

        connection.connect(function (err) {
            if (err)
            {
                throw err;
            }

            var sqlRequest = getreq[table];

            connection.query(
                {
                    sql: sqlRequest
                },
                function (err, rows) {
                    if (err)
                    {
                        fail400(response);
                    }
                    response.end(JSON.stringify(rows));
                    //ok200(response);
                }
            );

        });

    } else if (request.method == "PUT") {
        var putreq = {
            "band": "update band set band_name = ? where band_name = ?",
            "city": "update city set city_name = ? where city_name = ?",
            "finances_spendings": "update finances set spendings = ? where band_id = ? && tour_date_id = ? ",
            "finances_revenues": "update finances set revenues = ? where band_id = ? && tour_date_id = ?"
        };

        connection.connect(function (err) {
            if (err)
            {
                throw err;
            }
            var sqlRequest = putreq[table];
            connection.query(
                {
                    sql: sqlRequest,
                    values: [param1, param2, param3]
                },
                function (err) {
                    if (err)
                    {

                        fail400(response);
                    }

                    ok200(response);
                }
            );

        });

    } else if (request.method == "POST") {
        var postreq = {
            "band": "insert into band values(null, ?, null)",
            "city": "insert into city values(null, ?, ?)",
            "finances": "insert into finances values(null, ?,?,?,?)"
        };

        connection.connect(function (err) {
            if (err)
            {
                throw err;
            }

            var sqlRequest = postreq[table];
            connection.query(
                {
                    sql: sqlRequest,
                    values: [param1, param2, param3, param4]
                },
                function (err) {
                    if (err)
                    {
                        fail400(response);
                    }
                    ok201(response);
                }
            );

        });

    } else if (request.method == "DELETE") {


        if (table == "band") {

            connection.query(
                "delete from finances where band_id = (select id from band where band_name = ?)",
                [param1],
                function (err) {
                    if (err)
                    {
                        fail400(response);
                    }

                    connection.query("delete from band where band_name = ?", [param1], function (err) {
                        if (err)
                        {
                            fail400(response);
                        }
                        ok200(response);
                    });
                });

        }

        else if (table === "city") {

            connection.query(
                "delete from finances where tour_date_id = (select id from city where city_name = ?)",
                [param1],
                function (err) {
                    if (err)
                    {
                        fail400(response);
                    }

                    connection.query("delete from city where city_name = ?", [param1], function (err) {
                        if (err)
                        {
                            fail400(response);
                        }
                        ok200(response);
                    });
                });

        } else {
            var delreq = {
                "finances_band": "delete from finances where band_id = ?",
                "finances_city": "delete from finances where tour_date_id = ?",
                "finances_band_city": "delete from finances where band_id = ? and tour_date_id = ?"
            };

            connection.connect(function (err) {
                if (err)
                {
                    throw err;
                }

                var sqlRequest = delreq[table];
                connection.query(
                    {
                        sql: sqlRequest,
                        values: [param1, param2]
                    },
                    function (err) {
                        if (err)
                        {
                            fail400(response);
                        }
                        ok200(response);
                    }
                );

            });
        }

    } else
    {

        fail400(response);
    }

}

var server = http.createServer(handleRequest);

server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});