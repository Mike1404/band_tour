/**
 * Created by erick paquin et Michael Gabriel on 21/11/16.
 **/

var http = require('http');
var mysql = require('mysql');
var fs = require('fs');

const PORT = 8080;

function handleFile(request, response)
{

    if (! request.url.match(/^.*\..*$/))
    {
        return false;
    }

    var extension = request.url.split(".")[1];
    var types =
        {
        "html": "text/html",
        "jpg": "image/jpeg",
        "gif": "image/gif",
        "css":"text/stylesheet"
        };

    var mimeType = types[extension];
    if ( mimeType != undefined)
    {

        response.setHeader('Content-Type', mimeType);
    }

    fs.readFile( __dirname + request.url, function (err, data)
    {
        if (err)
        {
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

function ok200(response, TableName)
{
    response.statusCode = 200;
    response.end(TableName);
}

function fail400(response)
{
    response.statusCode = 400;
    response.end("BAD REQUEST!!");
}

function handleRequest(request, response)
{
    if (handleFile(request,response))
    {
        return;
    }
    if (request.url == "/favicon.ico")
    {
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

    if (request.method == "GET")
    {
        var getreq =
            {
            "band": "select * from band",
            "city": "select * from city",
            "finances": "select * from finances"
            };

        connection.connect(function (err)
        {
            if (err)
            {
                throw err;
            }

            var sqlRequest = getreq[table];

            connection.query(
                {
                    sql: sqlRequest
                },
                function (err, rows)
                {
                    if (err)
                    {
                        fail400(response);
                    }
                    response.end(JSON.stringify(rows));
                    //ok200(response);
                }
            );
        });
    }
    else if (request.method == "PUT")
    {

        var string = decodeURI(request.url).substring(1);
        var info = JSON.parse(string);
        var TableName = info.TableName;
        var TheId = Number(info.TheId);
        var RowData = info.TheInfo;

        var putreq =
            {
            "band": "update band set band_name = ?, financial_status = ? where id = ?",
            "city": "update city set city_name = ?, tour_date = ? where id = ?",
            "finances": "update finances set spendings = ?, revenues = ? where id = ? "
            };

        connection.connect(function (err)
        {
            if (err)
            {
                throw err;
            }

            var sqlRequest = putreq[TableName];

            if (TableName == "finances")
            {
                connection.query(
                    {
                        sql: sqlRequest,
                        values: [RowData[3], RowData[4], TheId]
                    },
                    function (err)
                    {
                        if (err)
                        {
                            fail400(response);
                        }
                        ok200(response, TableName);
                    }
                );
            }
            else if (TableName == "band")
            {
                connection.query(
                    {
                        sql: sqlRequest,
                        values: [RowData[1], RowData[2], TheId]
                    },
                    function (err)
                    {
                        if (err)
                        {
                            fail400(response);
                        }
                        ok200(response, TableName);
                    }
                );
            }
            else
            {
                connection.query(
                    {
                        sql: sqlRequest,
                        values: [RowData[1], RowData[2], TheId]
                    },
                    function (err)
                    {
                        if (err)
                        {
                            fail400(response);
                        }
                        ok200(response, TableName);
                    }
                );
            }
        });
    }
    else if (request.method == "POST")
    {

        var string = decodeURI(request.url).substring(1);
        var info = JSON.parse(string);
        var TableName = info.TableName;
        var RowData = info.TheInfo;

        var postreq =
            {
            "band": "insert into band values(null, ?, null)",
            "city": "insert into city values(null, ?, ?)",
            "finances": "insert into finances values(null, ?,?,?,?)"
            };

        connection.connect(function (err)
        {
            if (err)
            {
                throw err;
            }

            var sqlRequest = postreq[TableName];

            if (TableName == "finances")
            {
                connection.query(
                    {
                        sql: sqlRequest,
                        values: [RowData[1], RowData[2], RowData[3], RowData[4]]
                    },
                    function (err)
                    {
                        if (err)
                        {
                            fail400(response);
                        }
                        ok200(response, TableName);
                    }
                );
            }
            else if (TableName == "band")
            {
                connection.query(
                    {
                        sql: sqlRequest,
                        values: [RowData[1]]
                    },
                    function (err)
                    {
                        if (err)
                        {
                            fail400(response);
                        }
                        ok200(response, TableName);
                    }
                );
            }
            else
            {
                connection.query(
                    {
                        sql: sqlRequest,
                        values: [RowData[1], RowData[2]]
                    },
                    function (err)
                    {
                        if (err)
                        {
                            fail400(response);
                        }
                        ok200(response, TableName);
                    }
                );
            }
        });

    }
    else if (request.method == "DELETE")
    {

        var string = decodeURI(request.url).substring(1);
        var info = JSON.parse(string);
        var TableName = info.TableName;
        var RowData = info.TheInfo;

            if (TableName == "band")
            {
                connection.query(
                    "delete from finances where band_id = (select id from band where band_name = ?)",
                    [RowData[1]],
                    function (err)
                    {
                        if (err)
                        {
                            fail400(response);
                        }

                        connection.query("delete from band where band_name = ?", [RowData[1]], function (err)
                        {
                            if (err)
                            {
                                fail400(response);
                            }
                            ok200(response, TableName);
                        });
                    });
            }
            else if (TableName == "city")
            {

                connection.query(
                    "delete from finances where tour_date_id = (select id from city where city_name = ?)",
                    [RowData[1]],
                    function (err)
                    {
                        if (err)
                        {
                            fail400(response);
                        }

                        connection.query("delete from city where city_name = ?", [RowData[1]], function (err)
                        {
                            if (err)
                            {
                                fail400(response);
                            }
                            ok200(response, TableName);
                        });
                    });

            }
            else
            {
                var delreq =
                    {
                    "finances": "delete from finances where band_id = ? and tour_date_id = ?"
                    };

                connection.connect(function (err)
                {
                    if (err)
                    {
                        throw err;
                    }

                    var sqlRequest = delreq[TableName];
                    connection.query(
                        {
                            sql: sqlRequest,
                            values: [RowData[1], RowData[2]]
                        },
                        function (err)
                        {
                            if (err)
                            {
                                fail400(response);
                            }
                            ok200(response, TableName);
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

server.listen(PORT, function ()
{
    console.log("Server listening on: http://localhost:%s", PORT);
});