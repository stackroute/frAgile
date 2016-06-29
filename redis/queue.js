var Queue = require('bull');
var request= require('request');
var storyPost=Queue("Server1",6379,'127.0.0.1');
var editStory=Queue("Server2",6379,'127.0.0.1');
var commentPost=Queue("Server3",6379,'127.0.0.1');

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
   console.log(res);
   if(!err && res.statusCode==201){
     console.log(body);
     done(null,body);
     //done(Error('some error'));
   }

 })


});

// commentPost.process(function(job,done){
//  var options={
//    url:"https://api.github.com/repos/"+owner+"/"+repo+"/issues/"+number+"/comments?access_token="+job.data.token,
//    headers:{
//      "content-type":'application/json',
//      "User-Agent":'Limber'
//    },
//    json:job.data.message
//  };
//  request.post(options,function(err,res,body){
// if(!err && res.statusCode="201") done(null,body);
// done(err,null);
//
// })
//
//
// })
//
// editStory.process(function(job,done){
//  var options = { method: 'PATCH',
//  url: 'https://api.github.com/repos/ChandaRoy/chat/issues/3',
//  qs:
//  { access_token: '79c01def46ae6e236c0cb481eee9af4659eeee18' },
//  headers:
//  {
//    "content-type":'application/json',
//    "User-Agent":'Limber'
//  },
//   json:job.data
// };
//
// request(options, function (error, response, body) {
//  if (error) throw new Error(error);
//
//  console.log(body);
// });
// })


module.exports.storyPost=storyPost;
// module.exports.editStory=editStory;
// module.exports.commentPost=commentPost;
