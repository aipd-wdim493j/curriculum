var fs = require('fs'),
    express = require('express')
    , app = express();

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
                            app.use(express.directory(__dirname+'/public/'));
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

var server = app.listen(process.env.C9_PORT || process.env.PORT || 3000);
console.log("WDIM493J Curriculum App is running on port " + server.address().port + " in " + app.get('env') + " mode.")
