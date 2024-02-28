var express = require('express');
const env = require("dotenv").config();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;   
var app = express();
//const port=3000;


    // config for your database
    var config = {  
        server: process.env.DB_SERVER,  //update me
        authentication: {
            type: 'default',
            options: {
                userName: process.env.DB_USER, //update me
                password: process.env.DB_PWD  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            trustedConnection: true,
            encrypt: true,
            enableArithAbort: true,
            trustServerCertificate: true,
            stream: false,
            database: process.env.DATABASE  //update me
        }
    };  

    // connect to your database
    var connection = new Connection(config); 
    connection.on("connect", function (err) {
        if(err) {
          console.log('Error: ', err)
        } else {
          console.log("Successful connection");
          executeStatement();
        }
      });
    
    
    connection.connect();

    function executeStatement() {  
        var request = new Request("SELECT * FROM test1.Bowlers", function(err) {  
        if (err) {  
            console.log(err);}  
        });  
        var result = "";  
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result+= column.value + " ";  
              }  
            });  
            console.log(result); 
            app.get('/', (req,res)=>{
                res.send(result);
            });
            result ="";  
        });  
  
        request.on('done', function(rowCount, more) {  
        console.log(rowCount + ' rows returned');  
        });  
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);  
    }  
    
var server = app.listen(5000, function () {
    console.log('Server is running..');
});