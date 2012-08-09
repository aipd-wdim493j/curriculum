var express = require('express');

var app = express();

app.get('/', function(req, res) {
  res.json({hello: "world"});
});

app.listen(process.env.PORT || 5000);
