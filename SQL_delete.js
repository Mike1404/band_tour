/**
 * Created by Michael Gabriel et Erick Paquin on 09/11/16.
 *
 * Simple script to delete all data from db tables while testing insert script.
 *
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
            }, function(){
                connection.query(
                    {
                        sql: "delete from city"
                    }, function(){
                        connection.query(
                            {
                                sql: "DELETE FROM band"

                        },function(){
                            connection.end()  ;
                        });
                    });
            });
});