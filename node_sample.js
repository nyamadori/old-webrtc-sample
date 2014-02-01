var http = require('http');
var fs   = require('fs');

var server = http.createServer();

server.on('request', doRequest);
server.listen(process.env.PORT, process.env.IP);
console.log('Server running!');
 
// リクエストの処理
function doRequest(req, res) {
  fs.readFile("./hello.html", 'UTF-8', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  })
}
