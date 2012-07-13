var fs = require('fs');

fs.readdir('.', function(err, files) {
	files.forEach(function(file){
		fs.stat(file, function(err, stat){
			if(stat.isDirectory()){
				console.log(file + '/');
			} else {
				console.log(file);
				}
		});
	});
});