var fib = require('fib');
var fib = require('child process'); 

	setTimeout(function() {
		colsole.log("setTimeout");
}, 1000);

console.time("fib");
fib(41);
console.timeEnd("fib");
