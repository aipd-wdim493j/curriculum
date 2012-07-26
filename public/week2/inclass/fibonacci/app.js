var fib = require('fib');

setTimeout(function() {
  console.log("setTimeout");  
}, 1000);

console.time("fib");
fib(41);
console.timeEnd("fib");
