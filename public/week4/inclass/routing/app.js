
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.page1);

var auth = function(req, res, next) {
  var user = req.query.user, pass = req.query.pass;
  if(user === "admin" && pass === "123") next();
  else res.redirect('/');
}
 
app.get('/admin', auth, function(req, res) {
  res.render('admin');
});

var users = {peterwooley: {name: "Peter Wooley", age: 26}};
app.param('name', function(req, res, next, name) {
  req.user = users[name];
  if(req.user)
    next();
  else
    throw new Error("User not found.");
});
app.get('/user/:name', function(req, res) {
  res.send(req.user.name + " is " + req.user.age + " years old.");
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
