var fs = require('fs'),
    express = require('express')
    , app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname+'/public'));
app.use(express.logger('dev'));

app.get("/", function(req, res) {
    fs.readdir('./public', function(err, files) {
        res.render('index.jade', {
            weeks:
                files
                    .filter(function(w) { return w.indexOf('week')===0 })
                    .map(function(file) {
                        if(file.indexOf('week') === 0) {
                            return {
                                title: "Week " + file.substring(4)
                                , href: file
                            };
                        }
                    })
                    .sort(function(a, b) {
                      return a.href.replace('week', '') - b.href.replace('week', '');
                    })
        });
    });
});

// This needs to be declared after the / route so it won't show a directory on the main page.
app.use(express.directory(__dirname+'/public/'));

var server = app.listen(app.get('port'));
console.log("WDIM493J Curriculum App is running on port " + app.get('port') + " in " + app.get('env') + " mode.")
