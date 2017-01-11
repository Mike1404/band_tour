/**
 * Created by Michael Gabriel et Erick Paquin on 09/11/16.
 * script populates tables in logical manner : 5 bands, 20 cities, one pay / spending amount per band, per city.
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

    connection.query(
        {
            sql: "delete from finances"
        }, function () {
            connection.query(
                {
                    sql: "delete from city"
                }, function () {
                    connection.query(
                        {
                            sql: "DELETE FROM band"

                        }, function () {

                            for (var i = 1; i < 6; i++) {           //script for table "band"

                                var band_name = "band" + i;

                                connection.query(
                                    {
                                        sql: "insert into band values(null, ?, null)",
                                        values: [band_name]
                                    });
                            }

                            for (var j = 1; j < 21; j++) {           //script for table "city" & "finance"

                                var city_name = "city" + j;
                                var demain = new Date(2016, 0, 20);
                                var tour_date = new Date(demain.setDate(demain.getDate() + j)).toLocaleDateString();

                                connection.query(
                                    {
                                        sql: "insert into city values(null, ?, ?)",
                                        values: [city_name, tour_date]
                                    });

                            }

                            for (var k = 1; k < 6; k++) {

                                connection.query(
                                    {
                                        sql: "select id from band where band_name = ?",
                                        values: ["band" + k]
                                    }, function (err, rows) {
                                        bandid = rows[0].id;
                                        getdateid(bandid);
                                    });
                            }

                            function getdateid(theval) {

                                var bandid = theval;

                                for (var l = 1; l < 21; l++) {

                                    connection.query(
                                        {
                                            sql: "select id from city where city_name = ?",
                                            values: ["city" + l]
                                        }, function (err, rows) {

                                            var dateid = rows[0].id;

                                            insertfinance(bandid, dateid);
                                        });
                                }
                            }

                            var insertedFinance = 0;

                            function insertfinance(bandid, dateid) {

                                var spendings = Math.random() * 1000;
                                var revenues = Math.random() * 1000;

                                connection.query(
                                    {
                                        sql: "insert into finances values(null, ?, ?, ?, ?)",
                                        values: [bandid, dateid, spendings, revenues]
                                    }, function (err) {
                                        if (err) throw err;
                                        insertedFinance++;
                                        if (insertedFinance == 100) {
                                            connection.end();
                                        }

                                    });
                            }
                        });
                });
        });
});

