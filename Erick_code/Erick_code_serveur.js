/**
 * Created by erickp on 21/11/16.
 */

var http = require('http');
var mysql = require('mysql');

const PORT=8080;


function handleRequest(request, response){

    // grab url parameters
    var url = request.url;
    var param1 = url.split("/")[1];
    var param2 = url.split("/")[2];

    // connect to MySQL
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'tour_manager',
        password: 'abcd',
        database: 'tour_finance'
    });

if(request.method == "GET"){
    var getreq = {
        "band": "select * from band where id = ?",
        "city": "select * from city where id = ?",
        "finances": "select * from finances where id = ?"
    };

    connection.connect(function (err) {

        var sqlRequest = req[tid];
        console.log(sqlRequest);
        connection.query(
            {
                sql: sqlRequest,
                values: [bandID]
            },
            function (err, rows){
                if (err) throw err;
                response.end(JSON.stringify(rows));
                connection.end();
            }
        );
        if (err) throw err;
    });


} else if (request.method == "PUT"){

} else if (request.method == "POST"){

} else if (request.method == "DELETE"){

} else {
    // if no method, throw error
}

} // end handlerequest




/////////////////////////////////////////////////////////////////////////
var server = http.createServer(handleRequest); // generate http server

server.listen(PORT, function(){ // start listening for requests

    console.log("Server listening on: http://localhost:%s", PORT);
});