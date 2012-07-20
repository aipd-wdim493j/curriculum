var request = require('request');
var cheerio = require('cheerio');
var argv = require('optimist').argv;

request('http://www.alistapart.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    console.log($("#ish em").text());
  }
})
