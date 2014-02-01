
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var os = require('os')

var interfaces = os.networkInterfaces();
var addresses = [];
for (k in interfaces) {
    for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

var app = express();

// all environments
app.set('ip', addresses[0] || 'localhost')
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
app.get('/javascripts/webrtc.js', function(req, res) {
  res.type('js');
  res.render('javascripts/webrtc', {address: app.get('ip') + ':' + app.get('port')});
});

server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ');
});

// WebSocket
var sio = socketio.listen(server);

sio.sockets.on("connection", function(socket) {
  socket.emit('connected', {message: 'hello!'});

  socket.on("join", function(data) {
    socket.emit("joined", {message: 'joined!'});
  });

  socket.on("quit", function(data) {
    
  });
});
