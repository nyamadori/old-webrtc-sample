var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var util = require('util');
var express = require('express');

var app = express();
app.engine('ejs', ejs.renderFile);

app.get('/', function(req, res) {
  template_params = {time_now: new Date().toString()}
  res.render('hello.ejs', template_params)
});

server = http.createServer(app).listen(process.env.PORT || 3000, process.env.IP);
addr = server.address();
console.log('Server running at ' + addr.address + ':' + addr.port);
 
