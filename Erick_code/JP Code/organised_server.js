/**
 * Created by ebeljea on 10/24/16.
 */


var http = require('http');
var mysql = require('mysql');

const PORT = 8080;

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'ebeljea',
    password: '',
    database: 'MonApplication'
});

function fail404(response) {
    response.statusCode = 404 ;
    response.end();
}

function fail500(response) {
    response.statusCode = 500;
    response.end();
}

function handleRequest(request, response) {

    if ( ! request.url.match(/^\/[a-z]+/) ) {
        fail404(response);
        return;
    }

    console.log(request.url);
    var url = request.url;
    var table = url.split("/")[1];
    var id = url.split("/")[2];

    if ( request.method == "PUT" ) {

        return;
    }

    if ( request.method == "GET" ) {

        if ( table == "professeur") {

            handleGetProfesseur(request, response, id);
            return;
        }
        fail404(response);
        return;
    }

    if ( request.method == "POST" ) {

        if ( table == "professeur") {

            handleCreateProfesseur(request, response);
            return;
        }
        fail404(response);
        return;
    }

    if ( request.method == "DELETE" ) {

        return;
    }

}

function respondWithMessage(response, message) {

    response.statusCode = 200;
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(message);
}

function respondWithMessageAndChild(response, message, parenturl, childId) {

    response.writeHead(201, {
            'Content-Type': 'application/json',
            'Location': parenturl + "/" + childId
    });

    response.end(message);
}

function checkAndReturn(response, err) {

    if ( err ) {
        fail500(response);
        return true;
    } else {
        return false;
    }
}

function handleCreateProfesseur(request, response) {

    var body = [];
    request.on('data', function(chunk) {
        body.push(chunk);
    }).on("error", function() {

        fail500(response);
    }).on('end', function() {
        var stringBody = Buffer.concat(body).toString();
        var input = JSON.parse(stringBody);

        pool.query("insert into professeur set ?", input, function(err, rows) {

            if ( checkAndReturn(response, err) ) return;

            input.id = rows.insertId;
            respondWithMessageAndChild(response, JSON.stringify(input), request.url, rows.insertId);
        });
    });
}

function handleGetProfesseur(request, response, id) {

    if ( id == undefined ) {
        pool.query("select * from professeur", function(err, rows) {

            if ( checkAndReturn(response, err) ) return;

            response.statusCode = 200;
            respondWithMessage(response, JSON.stringify(rows));
        });
    } else {

        pool.query("select * from professeur where id = ?", [id], function(err, rows) {

            if ( checkAndReturn(response, err) ) return;

            if ( rows.length == 0 ) {
                fail404(response);
            } else {

                respondWithMessage(response, JSON.stringify(rows[0]));
            }
        });
    }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function () {

    console.log("Server listening on: http://localhost:%s", PORT);
});