console.log("Server started!");

//import express, cors and parse required data
var fs = require('fs');
var data = fs.readFileSync('jsonfile.json'); // reading data from json file
var values = JSON.parse(data);

var cors = require('cors');

var express = require('express');

var app = express();
// serving port
var server = app.listen(3000);
//import socket.io
var socket = require('socket.io');
var io = socket(server);
// 
app.use(express.static('public'));
app.use('/StaticFiles', express.static('StaticFiles'));
app.use(cors());    //helps making public

//use a command
app.get('/command/:name/:value', commandFunction);

//function for command
function commandFunction(request,response){
    
    var data = request.params;
    var name = data.name;
    var value = Number(data.value);
    var reply;
    
    //add values to array
    values.push({
        "name": name,
        "value": value
    });
    
    //write the data to json file
    var data = JSON.stringify(values, null, 2);
    fs.writeFile('jsonfile.json', data, finished);
    
    function finished(err) {
      console.log('all set.');
      reply = {
        nimi: name,
        pisteet: value,
        status: "success"
      }
      //send succes reply
      response.send(reply);
    }
    
}  

    
app.get('/leader', leaderBoards);
app.set('json spaces', 2);
function leaderBoards(request,response){

    var valueArray = [];
    for(a in values){
        valueArray.push([a,values[a]]);
    }
    console.log(valueArray);
    // sorts the array by value
    var reply = values.sort(function(a, b){
    return b.value - a.value;
    });
    
    //shows the values on screen
    response.send(reply);
    
}

//
// socket stuff
//    
 
io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log("New conncetion: ",socket.id);
    console.log(socket.request.connection.remoteAddress); //ip address of the connected client
    socket.on('disconnect', function(){
        io.emit('user disconnected');
        console.log('user disconnected: '+socket.id);
    });
    
    socket.on('message', function(data){
           //happens on client message  
    });
}








    
    
    
    
    
