var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

app.get('/', function(req, res) { res.render('index') });

// Add the Socket.IO code here.
var io = socketio.listen(server);
io.on('connection', function(socket) {
    socket.on('message', function(data) {
        io.sockets.emit('message', data);
    });
});
