/**
 * Created by mike on 09/11/16.
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'mike',
    password: '',
    database: 'tour_finance'
});

connection.connect();

