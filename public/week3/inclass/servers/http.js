var http = require('http');
var util = require('util');
var fs = require('fs');
http.createServer(function (req, res) {
  if(req.url === "/favicon.ico") {
    fs.stat('./public/favicon.png', function(err, stat) {
      console.log(stat);
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": stat.size
      });

      var rs = fs.createReadStream('./public/favicon.png');
      util.pump(rs, res);

    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    setTimeout(function() {
      res.end('<h1>Two seconds later</h1>\n');
    }, 2000);
  }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

/** TODO
 * Redirect (Location header)
 * setTimeout
 * util.inspect
 * favicon.ico
 */
