var fs = require('fs'),
    express = require('express')
    , app = express.createServer();

app.use(express.static(__dirname+'/public'));
app.set('view options', { layout: false });


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
        });
    });
});

app.listen(process.env.C9_PORT || process.env.PORT || 80);
