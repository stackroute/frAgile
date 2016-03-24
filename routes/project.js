var express = require('express');
var router = express.Router();
var project = require('../models/project.js');
var user = require('../models/user.js');
var backLogsBugList = require('../models/backlogBuglist.js');
var fs = require('fs'),
    list;

/* GET home page. */

router.get('/', function(req, res, next) {
  //releaseId = req.query.id.replace("/","");
  projectId = req.query.id.replace("/","");
  project.findProj(projectId, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      // console.log(doc);
      // console.log("--------------------------");
      console.log(doc);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      res.send(doc);
    }
  });
  // fs.readFile("./public/json/"+req.query.id.replace("/","")+".json", "utf-8", function(error, data) {
  //    list = data;
  //    list =  JSON.parse(list);
  //    res.send(list);
  //    console.log("Reading Project.json");
  // });
});

router.post('/', function(req, res, next) {
  var newProject = new project(
    {
      name : "Project 2",
      description : "project 1 is a project. What else it can be!",
      date : Date.now()
    }
  );
  newProject.save(function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      console.log("----------------Ready to creay backLogsBugList");
      var backBug = new backLogsBugList(
        {
          projectId : doc._id,
          backlogs: {
            listName: "Backlogs"
          },
          buglist: {
            listName: "BugLists"
          }
        }
      );
      backBug.save(function(err, doc) {
        if(err){
          res.send(err);
        }
        else {
          console.log("------------ Done addong backBug");
          res.send(doc);
        }
      });
    }
  });
});

router.post('/release', function(req, res, next) {
  projectId = "56ea78ea15eac2a96fedb5ee"; // TODO: get dynamic data
//  console.log(project);
  release = {
    name : "Release Name 2",
    description : "Bla bla bla Description 2",
    creationDate : Date.now(),
    releaseDate : Date.now()
  };
  project.addRelease(projectId, release, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.post('/updateProject', function(req, res, next) {
  projectId = "56ea78ea15eac2a96fedb5ee"; // TODO: get dynamic data
  newProject = {};
  newProject.name = "Batman";
  newProject.description = "I am awesome";
  newProject.date = Date.now();
  project.updateProject(projectId, newProject, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.post('/addMember', function(req, res, next) {
  console.log("-------------------  Adding member started");
  projectId = "56ea78dd15eac2a96fedb5ec"; // TODO: get dynamic data
  memberId = ["56efe4afb0d86f2b174916fe","56efe48c52719111179e6de1"];
  project.addMember(projectId, memberId, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {

      user.addProjectToUser(memberId, projectId, function(data) {
        console.log("-----------------------------------------Done Adding");
        res.send(data);
      });
    }
  });
});

router.post('/removeMember', function(req, res, next) {
  console.log("-------------------  Removing member started");
  projectId = "56ea78dd15eac2a96fedb5ec"; // TODO: get dynamic data
  memberId = "56efe48c52719111179e6de1";
  project.removeMember(projectId, memberId, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {

      user.removeProjectfromUser(memberId, projectId, function(data) {
        console.log("-----------------------------------------Done Removing");
        res.send(data);
      });
    }
  });
});

router.post('/updateRelease', function(req, res, next) {
  projectId = "56ea78ea15eac2a96fedb5ee";
  releaseId = "56ea796e924ce3c56f7d2e57"; // TODO: get dynamic data
  // newProject = {};
  // newProject.name = "Batman";
  // newProject.description = "I am awesome";
  // newProject.date = Date.now();
  newRelease = {};
  newRelease.name = "Deadpool";
  newRelease.description = "I am awesome";
  newRelease.creationDate = Date.now();
  newRelease.releaseDate = Date.now();
  console.log("--------------------- newRelease > " + newRelease.name);
  project.updateRelease(projectId, releaseId, newRelease, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      res.send(doc);
    }
  });
});


module.exports = router;
