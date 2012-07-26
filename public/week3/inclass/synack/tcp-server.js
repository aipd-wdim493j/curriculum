var net = require('net');

var s = net.Server(function(socket) {
  socket.on('data', function(d) {
    var rec = d.toString().trim();
    var send = "";
    console.log("Received: " + rec);
    switch(rec) {
      case "SYN":
        send = "SYN-ACK";
        break;
      case "ACK":
        console.log("Connection Established.");
        return;
    }
    console.log("Sending: " + send);
    socket.write(send + "\r\n");
  });

  socket.on('end', function() {
    console.log("Connection Closed.");
  });
});

s.listen(8000);
console.log("TCP Server listening on port 8000");

