var request = require('request'),
       cheerio = require('cheerio'),
       argv = require('optimist').argv;

	   
	   
console.log(process.argv);
console.log("starting to fetch ALA number." );
console.time("cogsworth");
request('http://www.alistapart.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
	console.log("finished the fetch.");
	console.timeEnd("cogsworth");
    $ = cheerio.load(body);
    console.log($("#ish em").text());
  }
})
