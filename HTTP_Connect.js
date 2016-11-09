/**
 * Created by mike on 09/11/16.
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'tour_manager',
    password: 'abcd',
    database: 'tour_finance'
});

connection.connect(function (err) {
    connection.query(
        {
            sql: "select * from band"
        },
        function (err, rows, fields) {
            if (err) throw err;

            console.log("INPUT!!");
            for (var a = 0; a < rows.length; a++) {

                console.log("band", rows[a].prenom, rows[a].nom);
            }
            connection.end();
        }
    )
});
