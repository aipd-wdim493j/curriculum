var express = require('express');
var redis = require('redis');
var client = redis.createClient();

var app = express();

app.get('/', function(req, res) {
  client.get('foo', function(err, foo) {
    res.json({foo: foo});
  });
  client.incr(hit);
  client.zincrby();
});

app.get(('*', function(req, res) {
  client.zincrby(['localhost:this', 1, req.url]) {
});

app.get(('*', function(req, res) {
  client.zrevrangebyscore(['localhost:this', ]) {
});

app.listen(process.env.PORT || 5000);
