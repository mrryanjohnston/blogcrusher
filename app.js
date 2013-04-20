/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , marked = require('marked')
  , posts = require('./routes/posts')
  , http = require('http')
  , path = require('path')
  , sitename = 'mrryanjohnston';

app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('sitename', sitename);
app.set('months', [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ]);
app.set('md', marked);
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// Read a file from posts under the year, month and day subdirs with the 
// slugname for the file.
app.get('/:year/:month/:day/:slug', posts.single);
// Daily posts
app.get('/:year/:month/:day', posts.dayMultiple);
// Monthly posts
app.get('/:year/:month', posts.monthMultiple);
// Yearly posts
app.get('/:year', posts.yearMultiple);
// Index
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
