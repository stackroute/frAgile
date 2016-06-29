var router = require('express').Router();
var mongoose = require('mongoose');
var User = require('../models/user.js');
var GithubRepo = require('../models/githubRepo.js');
var Project = require('../models/project.js');
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
        res.send(JSON.parse(body));
      }

    })
  })

})
//http.request("/repo")
module.exports = router;
