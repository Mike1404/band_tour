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

                    console.log("added band " + courant);
                }
            }(i));
        for (var j = 0; j < 100; j++) {           //script for table "city"

            var city_name = "city " + j;
            var demain = new Date(2016, 0, 20);
            var tour_date = new Date(demain.setDate(demain.getDate()+j));
            connection.query(
                {
                    sql: "insert into city values(null, ?, ?)",
                    values: [city_name, tour_date]
                },

                function (courant) {
                    return function (err, rows) {
                        if (err) throw err;

                        console.log("added city " + courant);
                    }
                }(j));
            //for (var k = 0; k < 100; k++) {           //script for finances "finances"

                var spendings = Math.random()*1000;
                var revenues = Math.random()*1000;
                connection.query(
                    {
                        sql: "insert into finances values(null, ?, ?, ?, ?)",
                        values: [band_name, tour_date, spendings, revenues]
                    },

                    function (courant) {
                        return function (err, rows) {
                            if (err) throw err;

                            console.log("added finances " + courant);
                        }
                    });

        }
    }


    connection.end();
});
