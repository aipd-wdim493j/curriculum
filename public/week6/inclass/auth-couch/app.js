// ## Auth with Passport
// Here, we use Passport's LocalStrategy within an Express app.
var express = require('express');
var http = require('http');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var crypto = require('crypto');
var async = require('async');
var cradle = require('cradle');

var conn = new cradle.Connection();
var db = conn.database('auth');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  // We need cookies for the flash() middleware to work.
  app.use(express.cookieParser('roar'));
  app.use(flash());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(express.session({secret: 'of the secret'}));
  // The passport middleware is used handle our authentication.
  // We configure the authentication below.
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});


// Here's a helper method to hash a given password with PBKDF2
// It's not bcrypt, but it'll do.
var getHash = function(password, cb) {
  crypto.pbkdf2(password, "mmmSalty", 2048, 40, cb);
};

// We setup our global `users` array to use in place of a proper database
var users = [];

// Now, we use async to hash two passwords and use them
// to create our default users (bob and joe!).
async.parallel({
  secret: function(cb) { getHash("secret", cb); },
  birthday: function(cb) { getHash("birthday", cb) }
}, function(err, hashes) {
  users.push({ id: 1, username: 'bob', password: hashes.secret, email: 'bob@example.com' })
  users.push({ id: 2, username: 'joe', password: hashes.birthday, email: 'joe@example.com' })
});

// When a user logs in with their username, we need to be able to find the user object. So, here ya go.
function findByUsername(username, fn) {
    db.view('user/byUsername', {key: username}, function(err, res) {
        if(err || !res.length) return fn(null, null); 
        console.log(err, res);
        fn(null, res[0].value);
    });
}

// This is middleware we'll use to make sure an unauthenticated user can get to `/account`.
function ensureAuthenticated(req, res, next) {
  // Note how Passport gives us an `isAuthenticated()` function on the request object.
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};

// To use Passport's built-in session support, we need to be able to serialize a user
// Here, we just store the `username`, which we'll use deserialize...
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

// ... right here! So, we take the `username` we stored in the session and use our `findByUsername()`
// to get the user object back.
passport.deserializeUser(function(username, done) {
  findByUsername(username, function (err, user) {
    done(err, user);
  });
});

// Here we're actually configuring Passport. Since we're doing local username/password
// (as opposed to Twitter OAuth or something else), we use the LocalStrategy.
passport.use(new LocalStrategy(
  // This is the function that runs when a user attempts to authenticate.
  function(username, password, done) {
    // We first check to see if a username exists
    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }

      // Then we check if the password the user provided matches the one we have stored.
      // We use `getHash()` again because we need to hash the provided password to compare
      // it to the stored password. Note that we never decrypt the password hash. Hashes
      // are one-way operations, you can't decrypt them.
      getHash(password, function(err, key) {
        if(err || key !== user.password) return done(null, false, {message: 'Invalid password'});
        return done(null, user);
      });
    })
  }
));

// Our home page route passes a user object if it exists.
// Note that Passport adds the user property to the request object if the user is logged in.
app.get('/', function(req, res) { res.render('index', {user: req.user})});

// The login page isn't anything special (it just renders the login form,
// save for the user of `req.flash()`, which is provided by connect-flash.
// Essentially, `flash()` lets you save a key/value pair for one page request.
// This is handy for showing error messages when redirecting, since you only
// want to show the error messages once.
app.get('/login', function(req, res) {
  res.render('login', { user: req.user, message: req.flash('error') });
});

// Here's the Passport magic. When the user posts the login form, we use the
// passport.authenticate middleware. This function calls the LocalStrategy function we
// defined above and handles redirecting if the user didn't give us correct
// user credentials. If they did provide valid credentials, we just redirect them
// back to the home page.
app.post('/login',
  passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  }
);

// Once the user is logged in, they can get to the `/account` page. To make sure
// unauthenticated users can't see the account page, we use the ensureAuthenticated
// middleware we defined above. This checks if the user is authenticated before allowing
// the request to go on.
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

// The `req.logout()` method is provided by Passport and provides an easy way to end
// a user's authenticated session. Note that after a user is logged out, you still need to
// redirect them to a new page.
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Registration will be your job, but this route will at least show the user the
// registration page.
app.get('/register', function(req, res) {
  res.render('register', {message: req.flash('error')});
});

// Your job is to write the logic for registering a new user.
// If the user doesn't provide all needed info (username, email, password),
// make sure to send them back to the registration form and tell them they messed up.
// If they provide the needed details, add the user then let them login.
app.post('/register', function(req, res) {
    if(req.body.username && req.body.password && req.body.email) {
        getHash(req.body.password, function(err, hash) {
            //users.push({username: req.body.username, password: hash, email: req.body.email});
            db.save({username: req.body.username, password: hash, email: req.body.email}, function(err, result) {
                res.redirect('/login');
            });
        });
    } else {
        req.flash('error', 'You messed up.');
        res.redirect('/register');
    }
});

// And, of course, we need to start our Express app.
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
