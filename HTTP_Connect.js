/**
 * Created by Michael Gabriel et Erick Paquin on 09/11/16.
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

    for (var i = 0; i < 5; i++) {           //script for table "band"

        var band_name = "band " + i;
        connection.query(
            {
                sql: "insert into band values(null, ?, null)",
                values: [band_name]
            },

            function (courant) {
                return function (err, rows) {
                    if (err) throw err;

                    console.log("added " + courant);
                }
            }(i));
    }
    for (var j = 0; j < 100; j++) {           //script for table "city"

        var city_name = "city " + j;
        var demain = new Date(2016, 4, 20);
        var tour_date = demain.getDate()+j;
        connection.query(
            {
                sql: "insert into city values(null, ?, ?)",
                values: [city_name, tour_date]
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
