var events = require('events');
var emitter = new events.EventEmitter();
 
emitter.on("data", function(err, data) {
  if(err) return console.log("Error!");
  console.log("Data: " + data);
});

emitter.emit("data", "No data");
emitter.emit("data", null, "Howdy, Howdy, Howdy!");
