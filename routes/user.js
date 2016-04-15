var router = require('express').Router();
var mongoose = require('mongoose');

var Activity = require('../models/activity.js');
var User = require('../models/user.js');
var Project = require('../models/project.js');
var Sprint = require('../models/sprint.js');
var Story = require('../models/story.js');


//to get projects of a userID
router.get('/projects', function(req, res, next) {
  if (req.query.id) {
    User.getProjects(req.query.id, function(data) {
      res.send(data);
    })
  } else {
    res.end()
  }
});

//to add project to a user
router.post('/addProject', function(req, res, next) {
  if (req.body.userID && req.body.projectID) {
    User.addProjectToUser(req.body.userID, req.body.projectID, function(err, data) {
      if (err)
        res.send("false");
      else {
        res.send(data);

      }
    })
  } else {
    res.send("false")
  }
});

router.get('/getUserId', function(req, res, next) {
  if (req.query.email) {
    User.getUserId(req.query.email, function(err, data) {
      if (err)
        res.send("false");
      else
        res.send(data);
    })
  }
  else {
    res.end();
  }
})

module.exports = router;
