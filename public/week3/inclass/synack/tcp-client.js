var net = require('net');
var client = net.connect({port: 8000},
    function() { //'connect' listener
  console.log("TCP Client connected to port 8000.");
  client.write('SYN\r\n');
});
client.on('data', function(d) {
  var rec = d.toString().trim();
  var send = "";
  console.log("Received: " + rec);
  switch(rec) {
    case "SYN-ACK":
      send = "ACK";
  }
  console.log("Sending: " + send);
  client.write(send + "\r\n");
});
client.on('end', function() {
  console.log('Client Disconnected');
});

