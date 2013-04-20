var fs = require('fs')
  , encoding = "utf8"
  , numberOfPosts = 10
  , renderpost = require('../lib/renderpost').renderpost;

/*
 * GET home page.
 */

// Assumptions:
// There are no empty dirs in years, months or days.
// If there's a yyyy/mm/dd directory structure, there had better be am .md
// file in there somewhere.
exports.index = function(req, res){
  // Only show stuff posted for after today.
  var today = new Date()
    , dd    = today.getDate()
    , mm    = today.getMonth()+1
    , yyyy  = today.getFullYear()
    , error = ''
    , posts = [];

  fs.readdir('posts/', function(err, years) {
    var closestYear = '';
    for (var x = 0; x < years.length; x++) {
      if (yyyy < parseInt(years[x])) {
        break;
      }
      closestYear = years[x];
    }
    fs.readdir('posts/'+closestYear, function(err, months) {
      var closestMonth = '';
      for (var y = 0; y < months.length; y++) {
        if (mm < parseInt(months[y])) {
          break;
        }
        closestMonth = months[y];
      }
      fs.readdir('posts/'+closestYear+'/'+closestMonth, function(err, days) {
      var closestDay = '';
        for (var z = 0; z < days.length; z++) {
          if (dd < parseInt(days[z])) {
            break;
          }
          closestDay = days[z];
        }
        // Previous button
        var previousUri = '';
        if (days.length != 1) {
          previousUri = '/'+closestYear+'/'+closestMonth+'/'+days[z-2]+'/';
          fs.readdir('posts/'+previousUri, function(err, postFiles) {
            if (err) return console.log(err);
            previousUri += postFiles[0].substring(0, postFiles[0].length - 3);
          });
        } else {
          if (months.length != 1) {
            previousUri = '/'+closestYear+'/'+months[y-2]+'/';
            fs.readdir('posts/'+previousUri, function(err, days) {
              if (err) return console.log(err);
              var day = days[days.length-1];
              previousUri += day+'/';
              fs.readdir('posts/'+previousUri, function(err, postFiles) {
                if (err) return console.log(err);
                previousUri += postFiles[0].substring(0, postFiles[0].length - 3);
              });
            });
          } else {
            if (years.length != 1) {
              previousUri = '/'+years[x-2]+'/';
              fs.readdir('posts/'+previousUri, function(err, months) {
                if (err) return console.log(err);
                var month = months[months.length-1];
                previousUri += month+'/';
                fs.readdir('posts/'+previousUri, function(err, days) {
                  if (err) return console.log(err);
                  var day = days[days.length-1];
                  previousUri += day+'/';
                  fs.readdir('posts/'+previousUri, function(err, postFiles) {
                    if (err) return console.log(err);
                    previousUri += postFiles[0].substring(0, postFiles[0].length - 3);
                  });
                });
              });
            } else {
              previousUri = undefined;
            }
          }
        }
        fs.readdir('posts/'+closestYear+'/'+closestMonth+'/'+closestDay, function(err, postFiles) {
          renderpost('posts/'+closestYear+'/'+closestMonth+'/'+closestDay+'/'+postFiles[0],
            {encoding: encoding}, function(err, post) {
            if (err) return console.log(err);
            res.render('single-post', { title: post.metadata[0], author: post.metadata[1],
              postcontent: post.postcontent, date: post.date, sitename: app.get('sitename'),
              md: app.get('md'), previous: previousUri}); 
          });
        });
      });
    });
  });
};
