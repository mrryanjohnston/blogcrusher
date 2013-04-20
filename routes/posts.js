var encoding = "utf8"
  , fs = require('fs')
  , renderpost = require('../lib/renderpost').renderpost
  , renderpostSync = require('../lib/renderpost').renderpostSync;

/*
 * GET single post page.
 */

exports.single = function(req, res){
  // Read a file from posts under the year, month and day subdirs with the 
  // slugname for the file.
  var blogPostPath = 'posts/'+req.params.year+'/'+req.params.month+'/'+
    req.params.day+'/'+req.params.slug+'.md';
  renderpost(blogPostPath, {encoding: encoding}, function(err, post) {
    if (err) return res.send('This post does not exist or it has been deleted.', 404);
    res.render('single-post', { title: post.metadata[0], author: post.metadata[1],
      postcontent: post.postcontent, date: post.date, sitename: app.get('sitename'),
      md: app.get('md'), previousUri: makePreviousUri(req.params)}); 
  });
};

var makePreviousUri = function(params) {
  var year = params.year
    , month = params.month
    , day = params.day;

  // Todo
  return undefined;
}

exports.yearMultiple = function(req, res) {
  var yearPostPath = 'posts/'+req.params.year
    , posts = [];
  fs.readdirSync(yearPostPath).reverse().forEach(function(month) {
    fs.readdirSync(yearPostPath+'/'+month).reverse().forEach(function(day) {
      fs.readdirSync(yearPostPath+'/'+month+'/'+day).reverse().forEach(function(postFile) {
        var post = renderpostSync(yearPostPath+'/'+month+'/'+day+'/'+postFile
          , {encoding: encoding, trim: true});
        posts.push({ title: post.metadata[0], author: post.metadata[1],
          postcontent: post.postcontent, date: post.date, uri: post.uri});
      });
    });
  });
  res.render('multiple-post', { posts: posts, sitename: app.get('sitename'),
  md: app.get('md')}); 
};

exports.monthMultiple = function(req, res) {
  var monthPostPath = 'posts/'+req.params.year+'/'+req.params.month
    , posts = [];
  fs.readdirSync(monthPostPath).reverse().forEach(function(day) {
    fs.readdirSync(monthPostPath+'/'+day).reverse().forEach(function(postFile) {
      var post = renderpostSync(monthPostPath+'/'+day+'/'+postFile
        , {encoding: encoding, trim: true});
      posts.push({ title: post.metadata[0], author: post.metadata[1],
        postcontent: post.postcontent, date: post.date, uri: post.uri});
    });
  });
  res.render('multiple-post', { posts: posts, sitename: app.get('sitename'),
  md: app.get('md')}); 
};

// Not done yet.
exports.dayMultiple = function(req, res) {
  var dayPostPath = 'posts/'+req.params.year+'/'+req.params.month+'/'+req.params.day
    , posts = [];
  fs.readdirSync(dayPostPath).reverse().forEach(function(postFile) {
    var post = renderpostSync(dayPostPath+'/'+postFile
      , {encoding: encoding, trim: true});
    posts.push({ title: post.metadata[0], author: post.metadata[1],
      postcontent: post.postcontent, date: post.date, uri: post.uri});
  });
  res.render('multiple-post', { posts: posts, sitename: app.get('sitename'),
  md: app.get('md')}); 
};
