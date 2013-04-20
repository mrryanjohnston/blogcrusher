var fs = require('fs');

exports.renderpost = function(blogPostPath, options, callback) {
  var months = app.get('months')
    , brokenPath = blogPostPath.split("/")
    , post = { date: months[parseInt(brokenPath[2])-1]+' '+brokenPath[3]+', '+brokenPath[1] };

  fs.readFile(blogPostPath, {encoding: options.encoding}, function(err, data) { 
    if (err) {
      callback('Post requested ('+blogPostPath+') does not exist.');
    } else {
      // Split the metadata at the top of the file from the actual content.
      var contentsArray = data.split("\nendmetadata\n");
      // If \nmetadata\n appears in more than just after the first bit,
      // recombine everything after it.
      if(contentsArray.length > 2) {
        contentsArray[1] = contentsArray.slice(1,contentsArray.length).join("\n");
      }
      post.metadata      = contentsArray[0].split("\n");
      post.postcontent   = contentsArray[1];
      post.uri = '/'+brokenPath[1]+'/'+brokenPath[2]+'/'+brokenPath[3]+'/'+
        brokenPath[4].substring(0, brokenPath[4].length - 3);

      callback(false, post);
    }
  });
}

exports.renderpostSync = function(blogPostPath, options) {
  var months = app.get('months')
    , brokenPath = blogPostPath.split("/")
    , post = { date: months[parseInt(brokenPath[2])-1]+' '+brokenPath[3]+', '+brokenPath[1] };

  var data =  fs.readFileSync(blogPostPath, {encoding: options.encoding});
  // Split the metadata at the top of the file from the actual content.
  var contentsArray = data.split("\nendmetadata\n");
  // If \nmetadata\n appears in more than just after the first bit,
  // recombine everything after it.
  if(contentsArray.length > 2) {
    contentsArray[1] = contentsArray.slice(1,contentsArray.length).join("\n");
  }
  post.metadata      = contentsArray[0].split("\n");
  post.postcontent   = contentsArray[1];
  post.uri = '/'+brokenPath[1]+'/'+brokenPath[2]+'/'+brokenPath[3]+'/'+
    brokenPath[4].substring(0, brokenPath[4].length - 3);

  return post;
}
