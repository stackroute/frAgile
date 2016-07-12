var router = require('express').Router();
var mongoose = require('mongoose');
var User = require('../models/user.js');
var GithubRepo = require('../models/githubRepo.js');
var Project = require('../models/project.js');
var Story=require('../models/story.js');
var request=require('request');
var github_api = require("./github-api.js");

router.post('/repos',function(req,res, next){
  console.log("in routes");
  console.log(req.body);
  var githubRepo= new GithubRepo();
  githubRepo.name=req.body.name;
  githubRepo.owner=req.body.owner;
  githubRepo.projectId=req.body.projectId;
  githubRepo.save(function(err){
    if(err){
      res.send(err)
    }
    else{
      Project.updateGithubStatus(req.body.projectId,function(error,data){
        if(error){
          res.send(error)
        }
        else res.end();
      })
    }

    // github_api.getIssues(options, function(error,response,body){
    //   if(error) {
    //     console.log("Error: ", error)
    //     res.send(error);
    //   }
    //   console.log("Success: ", response);
    //   res.send(body);
    // });
  })
  //res.end();
  // next();
})

router.get('/repos',function(req,res){

  console.log("user repos",req.user);
  var access_token=req.user.github.token;
  console.log(req.user.github.token);

  var options={
    url:'https://api.github.com/user/repos',
    qs:{access_token:access_token},
    headers:{
      "User-Agent":'Limber'
    }

  };
  //github_api.getRepos(options)
  github_api.getRepos(options, function(error,response,body){
    if(error) {
      console.log("Error in git api request: ", error);
      res.send(error);
    } else {
      res.send(JSON.parse(body));
    }
  });

})
router.get('/issues',function(req,res){
  GithubRepo.getRepo(req.query.projectId,function(err,doc){
    var projectId=req.query.projectId;

    console.log("Repo:",doc);
    var options={
      url:'https://api.github.com/repos/'+doc.owner+"/"+doc.name+"/issues",
      headers:{
        "User-Agent":'Limber'
      }
    };
    github_api.getIssues(options,function(error,response,body){
      if(error) {
        console.log("Error in issue: ", error);
        res.send(error);
      } else {

        var filteredBody=[];
        var issueNumbers=[];
        Story.findConvertedIssues(projectId,function(err,docs){
          docs.forEach(function(story){
            issueNumbers.push(story.issueNumber);
          })
          JSON.parse(body).forEach(function(item){
            if(issueNumbers.indexOf(item.number.toString())==-1)
            filteredBody.push(item);
          })
         res.send(filteredBody);
// res.send(JSON.parse(body));
        })
      }

    })
  })

})
router.post('/issues',function(req,res){
  // console.log("Issues req body: ", req.body);
  var issue=req.body;
  var projectId=issue.projectId;
  var message=issue.message;
  var github_profile=issue.github_profile;

  //@TODO validate if the mandatory values for creating this record are coming or not

  GithubRepo.getRepo(projectId,function(err,repoData){
    if(!err){
      var options={
        url:"https://api.github.com/repos/"+repoData.owner+"/"+repoData.name+"/issues?access_token="+github_profile.token,
        headers:{
          "content-type":'application/json',
          "User-Agent":'Limber'
        },
        json:message
      };
      console.log(options.url);

      request.post(options,function(err,response,body){
        console.log(response);
        if(!err && response.statusCode==201){
          console.log(body);
          res.send(body)
          //done(Error('some error'));
        }
        else res.send(err)

      })
    }
  })



})
// router.post("/issueEvents",function(req,res){
//   console.log("inside issueevents");
//   console.log(req.body);
// })
//http.request("/repo")
module.exports = router;
