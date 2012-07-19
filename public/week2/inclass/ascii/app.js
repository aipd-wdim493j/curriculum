var asciiart = require('asciiart');

asciiart.get('Node.js', function(text) {
  console.log(text);

  asciiart.get('is fun!', function(text) {
    console.log(text);
  });
});

