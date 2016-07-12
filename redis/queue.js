var Queue = require('bull');
var request= require('request');
var storyPost=Queue("Server1",6379,'127.0.0.1');
var editStory=Queue("Server2",6379,'127.0.0.1');
var commentPost=Queue("Server3",6379,'127.0.0.1');
var Story=require("../models/story.js");


storyPost.process(function(job,done){
 var options={
   url:"https://api.github.com/repos/"+job.data.repo_details.owner+"/"+job.data.repo_details.name+"/issues?access_token="+job.data.github_profile.token,
   headers:{
     "content-type":'application/json',
     "User-Agent":'Limber'
   },
   json:job.data.message
 };
 console.log(options.url);
 console.log(job.data);
 request.post(options,function(err,res,body){
   //console.log(res);
   if(!err && res.statusCode==201){
  console.log(body);
     Story.findOne({_id: job.data.message.storyId}, function (err, story) {
         story.issueNumber = body.number;
         story.save(function (err) {
             if(err) {
                 console.error('ERROR!');
             }
             done(null,body);

         });
     });


     //done(Error('some error'));
   }
   done(body,null)




 })


});

commentPost.process(function(job,done){
  var options={
    url:"https://api.github.com/repos/"+job.data.repo_details.owner+"/"+job.data.repo_details.name+"/issues/"+job.data.issueNumber+"/comments?access_token="+job.data.github_profile.token,
    headers:{
      "content-type":'application/json',
      "User-Agent":'Limber'
    },
    json:job.data.message,

  };
 request.post(options,function(err,res,body){
if(!err && res.statusCode==="201") done(null,body);
done(res,null);

})


})
//
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






module.exports.storyPost=storyPost;
// module.exports.storyPost=storyPost;
module.exports.editStory=editStory;
module.exports.commentPost=commentPost;
