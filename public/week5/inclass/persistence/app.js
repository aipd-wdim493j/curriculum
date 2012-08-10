var express = require('express');
var redis = require('redis');
var client = redis.createClient();

var app = express();

app.get('/', function(req, res) {
  client.get('foo', function(err, foo) {
    res.json({foo: foo});
  });
});

app.listen(process.env.PORT || 5000);
