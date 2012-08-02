var socketio = require('socket.io');
var socketioclient = require('socket.io-client');
var fs = require('fs');

var clients = [];

module.exports = {
  createServer: function(settings) {
    fs.watch(settings.path, function() {
      console.log(arguments);
    });

    var io = socketio.listen(settings.port);
    io.sockets.on('connection', function(socket) {
      clients.push(socket);
    });
  },
  createClient: function(settings) {
    var ws = socketioclient.connect(settings.host);
  }
}
