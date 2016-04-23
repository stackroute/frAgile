var router = require('express').Router();
var mongoose = require('mongoose');

var Activity = require('../models/activity.js');
var User = require('../models/user.js');
var Project = require('../models/project.js');
var Sprint = require('../models/sprint.js');
var Story = require('../models/story.js');

router.get('/',function(req,res,next){
  user ={
    _id : req.user._id,
    email : req.user.email
  }
  res.send(user);
});

router.get('/all',function(req,res,next){
  User.find({},{email : 1},function(err,data){
    res.send(data);
  })
})
//to get projects of a userID
router.get('/projects', function(req, res, next) {// LOGINCHANGE
  if (req.user._id) {
    User.getProjects(req.user._id, function(data) {
      res.send(data);
    })
  } else {
    res.end()
  }
});

//to add project to a user
router.post('/addProject', function(req, res, next) {
  if (req.user._id && req.body.projectID) {// LOGINCHANGE
    User.addProjectToUser(req.user._id, req.body.projectID, function(err, data) {
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

router.get('/getUsers', function(req, res, next){
  if(req.query.email){
    User.getUserEmail(req.query.email, function(err, data){
      if(!err){
        res.send(data);}
    })
  }
})

module.exports = router;
