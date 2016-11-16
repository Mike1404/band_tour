/**
 * Created by erickp on 09/11/16.
 */

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'tour_manager',
    password : 'abcd',
    database : 'tour_finance'
});

connection.connect(function(err){

    if(err) throw err;

    var lesligneajouter=0;

    for(i=0;i<1000;i++){

        var laville="laville"+i;
        var ladate=new Date();
        var lapaye=2000+i;
        connection.query(
            {
                sql: "insert into city values(null,?,?,?)",
                values: [laville, ladate, lapaye]
            })
        lesligneajouter += 1;
    }
if(lesligneajouter==1000){
    connection.end();
}

});