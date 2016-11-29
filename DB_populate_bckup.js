/**
 * Created by Michael Gabriel et Erick Paquin on 09/11/16.
 * script populates tables in logical manner : 5 bands, 100 cities, one pay / spending amount per band, per city.
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'tour_manager',
    password: 'abcd',
    database: 'tour_finance'
});

connection.connect(function (err, rows) {

    if (err) throw err;

    var financenums = 0;

    for (var i = 0; i < 5; i++) {           //script for table "band"

        var band_name = "band" + i;
        connection.query(
            {
                sql: "insert into band values(null, ?, null)",
                values: [band_name]
            });
    }


    for (var j = 0; j < 100; j++) {           //script for table "city" & "finance"

        var city_name = "city" + j;
        var demain = new Date(2016, 0, 20);
        var tour_date = new Date(demain.setDate(demain.getDate() + j));
        connection.query(
            {
                sql: "insert into city values(null, ?, ?)",
                values: [city_name, tour_date]
            });

        for (k = 0; k < 5; k++) {
            var spendings = Math.random() * 1000;
            var revenues = Math.random() * 1000;
            connection.query(
                {
                    sql: "insert into finances values(null, ?, ?, ?, ?)",
                    values: ["band" + k, tour_date, spendings, revenues]
                });
            financenums += 1;

        }

    }

    if (financenums == 500) {
        connection.end();
    }
});