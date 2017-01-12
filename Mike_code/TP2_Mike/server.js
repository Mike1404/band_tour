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
        "css":"text/css"
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

function calculatefinances(connection, response, bandtable)
{
    function findfinances(bandid, financeslist)
    {
        for (var i = 0; i<financeslist.length; i++)
        {
            if (financeslist[i].band_id == bandid)
            {
                return financeslist[i];
            }
        }
        return null;
    }

    var MoneyReq = "select band_id, sum(revenues - spendings) a from finances group by band_id";

    connection.query(
        {
            sql: MoneyReq
        },
        function (err, rows)
        {
            if (err)
            {
                fail400(response);
            }

            for (var i = 0; i < bandtable.length; i++)
            {
                var finances = findfinances(bandtable[i].id, rows);
                if(finances == null){ // adding new bands does NOT create finance record automatically so gotta check for this.
                    bandtable[i].finances = 0;
                }else{
                    bandtable[i].finances = finances.a;
                }

            }
            response.end(JSON.stringify(bandtable));
        }
    );
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
    var Table = url.split("/")[1];

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

            var sqlRequest = getreq[Table];

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
                    if (Table == "band")
                    {
                        calculatefinances(connection, response, rows);
                    }
                    else
                    {
                        response.end(JSON.stringify(rows));
                    }
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
            "band": "update band set band_name = ? where id = ?",
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
                        values: [RowData[1], TheId]
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
            "band": "insert into band values(null, ?)",
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