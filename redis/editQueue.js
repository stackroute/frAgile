var Queue = require('bull');
var request= require('request');

var editStory=Queue("Server2",6379,'127.0.0.1');



editStory.process(function(job,done){
  var options={
    url:"https://api.github.com/repos/"+job.data.repo_details.owner+"/"+job.data.repo_details.name+"/issues/"+job.data.issueNumber+"?access_token="+job.data.github_profile.token,
    headers:{
      "content-type":'application/json',
      "User-Agent":'Limber'
    },
    json:job.data.message,
    method: "PATCH"
  };

  console.log(options.url);
  console.log(job.data);
  request.post(options,function(err,res,body){
    console.log(res);
    console.log(body);
    console.log(res.statusCode);
    // if(!err && res.statusCode==201){
    //   console.log(body);
    //   done(null,body);
    //   //done(Error('some error'));
    // }
    done(body,null)


});
});
module.exports.editStory=editStory;
