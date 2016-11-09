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

    if (err) throw err;

    for (var i = 0; i < 1000; i++) {

        var band_name = "band " + i;
        var financial_status = 10000;
        connection.query(
            {
                sql: "insert into band values(null, ?, ?)",
                values: [band_name, financial_status]
            },

            function (courant) {
                return function (err, rows) {
                    if (err) throw err;

                    console.log("added " + courant);
                }
            }(i));
    }
    connection.end();
});
