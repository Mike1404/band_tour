/**
 * Created by erickp on 21/11/16.
 */

var http = require('http');
var mysql = require('mysql');

const PORT=8080;

var req = {
    "band": "select * from band where id = ?",
    "city": "select * from city where id = ?",
    "finances": "select * from finances where id = ?"
};
function handleRequest(request, response){

    if (request.url.toString().includes("ico")){
        response.end(); return
    }
    var url = request.url;
    var tid = url.split("/")[1];
    var bandID = url.split("/")[2];

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'tour_manager',
        password: 'abcd',
        database: 'tour_finance'
    });
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
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){

    console.log("Server listening on: http://localhost:%s", PORT);
});