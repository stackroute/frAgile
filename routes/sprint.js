var express = require('express');
var router = express.Router();
var sprint = require('../models/sprint.js');
var project = require('../models/project.js');
var fs = require('fs'),
    list;

/* GET home page. */

router.get('/', function(req, res, next) {
  sprintId = req.query.id.replace("/","");
  sprint.findSprint(sprintId, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.post('/updateSprint', function(req, res, next) {
  console.log("-----------------------inside updateSprint");
  sprintId = "56ea89de1d4b0a2572f25b9c"; // TODO: get dynamic data
  newSprint = {};
  newSprint.name = "Deadpool";
  newSprint.description = "I am awesome";
  newSprint.endDate = Date.now();
  newSprint.startDate = Date.now();
  sprint.updateSprint(sprintId, newSprint, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.post('/deleteList', function(req, res, next) {
  console.log("-----------------------inside deleteList");
  sprintId = "56ea89de1d4b0a2572f25b9c"; // TODO: get dynamic data
  listId = "56ea89de1d4b0a2572f25ba1";
  sprint.deleteList(sprintId, newSprint, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.post('/', function(req, res, next) {
  console.log("------------------------------1---------------------------");
  var newSprint = new sprint(
    {
      name: "new Sprint 2",
      endDate: Date.now(),
      startDate: Date.now(),
      description: "Description String 2",
          list: [
            {
              group : "inProgress",
              listName: "Picked",
              stories : []
            },
            {
              group : "inProgress",
              listName: "In progress",
              stories : []
            },
            {
              group : "inProgress",
              listName: "SSSSSSS",
              stories : []
            },
            {
              group : "inProgress",
              listName: "AAAAAA",
              stories : []
            },
            {
              group : "Releasable",
              listName: "Releasable",
              stories : []
            }
          ]
  }
  );
  newSprint.save(function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      projectId = "56ea78ea15eac2a96fedb5ee";
      releaseId = "56ea797b924ce3c56f7d2e58";
      project.addSprint(projectId, releaseId, doc, function(err, doc) {
        if(err){
          res.send(err);
        }
        else {
          res.send(doc);
        }
      });
    //  console.log(project);
      // project.updateRel(projectId, doc, function(err, doc) {
      //   if(err){
      //     res.send(err);
      //   }
      //   else {
      //     res.send(doc);
      //   }
      // });
    }
  });
});

module.exports = router;
