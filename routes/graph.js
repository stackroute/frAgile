var express = require('express');
var router = express.Router();
// var Subjects = require('./../models/SubjectViews');
//var app = require('../app');
var graph = require('../models/graph.js');

var mongoose = require('mongoose');

// var fs = require('fs'),
//     list;

/* GET home page. */
//
// router.get('/', function(req, res, next) {
//   fs.readFile("./public/json/graph_sprintStatus.json", "utf-8", function(error, data) {
//      list = data;
//      list1 =  JSON.parse(list);
//      res.send(list1);
//      console.log(" Reading Graphs ");
//   });
// });


router.get('/', function(req, res, next) {
  console.log("I am in route");
graph.getgraph("56efbed8e0feada51b660bab",function(err,doc){
if(err){
  res.send(err);
}else{
  res.send(doc);
}
});
});
// router.get('/', function(req, res, next) {
//     console.log("----------------------Story Details----------->");
//   var Subjects = app.db.collection('graphdata');
//   console.log("Subjects ------>"+Subjects);
//   Subjects.find({'_id': "56ea4a3f01dbb121bd351eb8" , "storyStatus" : 1},function(err,storyDetails){
//     console.log("----------------------Story Details----------->"+storyDetails);
//      if(err){
//        res.send(err);
//        return;
//      }
//      res.json(storyDetails);
//    });
// });

module.exports = router;
