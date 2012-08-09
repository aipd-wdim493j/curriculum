var fs = require('fs');
var express = require('express');
var codesocket = require('./lib/codesocket');
var argv = require('optimist').argv;
var app = express.createServer();

app.use(express.static(__dirname+'/public'));
app.set('view options', { layout: false });

app.get("/", function(req, res) {
    fs.readdir('./public', function(err, files) {
        res.render('index.jade', {
            weeks:
                files
                    .filter(function(w) { return w.indexOf('week')===0 })
                    .map(function(file) {
                        if(file.indexOf('week') === 0) {
                            return {
                                title: "Week " + file.substring(4)
                                , href: file
                            };
                        }
                    })
                    .sort(function(a, b) {
                      return a.href.replace('week', '') - b.href.replace('week', '');
                    })
        });
    });
});

var server = app.listen(process.env.C9_PORT || process.env.PORT || 3000);
console.log("WDIM493J Curriculum App is running on port " + server.address().port + " in " + app.get('env') + " mode.")

if(argv.server) { // If we're running as a server, start up codesocket server.
  codesocket.createServer({
    port: 3001,
    path: './public/week5/inclass'
  });
} else if(argv.host) { // If we're attaching to a host, start up codesocket client.
  codesocket.createClient({
    host: argv.host,
    dir: 'inclass-live'
  });
}

