var http = require('http');
var fs   = require('fs');
var ejs  = require('ejs');
var util = require('util');

var hello = fs.readFileSync('./hello.ejs', 'utf-8');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  template_params = {time_now: new Date().toString()}
  res.write(ejs.render(hello, template_params));
  res.end();
}).listen(process.env.PORT, process.env.IP);

addr = server.address();
console.log('Server running at ' + addr.address + ':' + addr.port);
 
