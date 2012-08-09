
/*
 * GET home page.
 */

exports.page1 = function(req, res){
  res.render('index', { title: 'Express' });
};
