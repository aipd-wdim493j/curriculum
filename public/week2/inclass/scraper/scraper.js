var request = require('request');
var cheerio = require('cheerio');
var argv = require('optimist').argv;

console.log(argv);
console.log("Starting to fetch ALA number.");
console.time("cogsworth");
request('http://www.alistapart.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log("Finished the fetch.");
    console.timeEnd("cogsworth");
    $ = cheerio.load(body);
    console.log($("#ish em").text());
  }
})
