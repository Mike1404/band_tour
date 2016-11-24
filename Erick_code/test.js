/**
 * Created by erickpaquin on 23/11/16.
 */
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log("Server listening on: http://localhost:3000");
});
