var router = require('express').Router();
var mongoose = require('mongoose');

var user = require('../models/user.js');
var team = require('../models/team.js');
var project = require('../models/project.js');

/* GET home page. */
router.post('/', function(req, res, next) {
  var userDetails = {
    firstName: "Soumitra",
    lastName: "Kar",
    email :"sksoumitrakar@gmail.com",
    password: "password"
  }
  user.addUser(userDetails,function(data){
    res.send(data);
  });
});


router.post('/removeProjectfromUser', function(req, res, next) {
  var userID = "56efe4b1b0d86f2b174916ff";
  var projectID = "56ea78ea15eac2a96fedb5ee";
  user.removeProjectfromUser(userID, projectID,function(data){
    res.send(data);
  });
});

module.exports = router;
