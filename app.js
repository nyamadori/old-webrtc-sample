
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ');
});

// WebSocket
var sio = socketio.listen(server);
var users = {};

sio.sockets.on("connection", function(client) {
  client.emit('connected', {user: {id: client.id}});
  users[client.id] = null;
  
  // クライアントからの offer を送る
  client.on('offer', function(data) {
    users[this.id] = {from: this.id, to: data.to}
    sio.sockets.socket(data.to).emit('offer', {sdp: data.sdp, from: this.id});
  });

  client.on('answer', function(data) {
    sio.sockets.socket(data.to).emit('answer', {sdp: data.sdp, from: this.id});
  });

  client.on('candidate', function(data) {
    sio.sockets.emit('candidate', {candidate: data.candidate});
  });
});
