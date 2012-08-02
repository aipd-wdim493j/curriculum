var net = require('net');

var sockets = [];

var s = net.Server(function(socket) {
  socket.on('error', function(e) { console.log(e); });
  sockets.push(socket);
  status();

  socket.nick = Math.random();

  socket.on('data', function(d) {

    if(d.toString().indexOf('/nick ') === 0) {
      var oldNick = socket.nick;
      
      socket.nick = d.toString().trim().split(' ')[1];
      socket.write("You are now known as " + socket.nick + "\r\n");

      for(var i = 0; i < sockets.length; i++) {
        if(sockets[i] == socket) continue;
        sockets[i].write(oldNick + " is now known as " + socket.nick + "\r\n");
      }
      
      return;
    }

    for(var i = 0; i < sockets.length; i++) {
      if(sockets[i] == socket) continue;
      sockets[i].write(socket.nick + ": " + d);
    }
  });

  socket.on('end', function() {
    var i = sockets.indexOf(socket);
    sockets.splice(i, 1);
    console.log(socket.nick + " has disconnected.");
    status();
  });
});

s.listen(8000);
console.log("TCP Chat Server running on Port 8000.");

function status() {
  console.log(sockets.length + " client" + (sockets.length === 1 ? '' : 's') + " connected.");
}
