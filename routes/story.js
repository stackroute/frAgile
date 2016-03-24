/***
Copyrights: StackRoute and Wipro Digital

Author:Sharan, Shrinivas and Soumitra
Date: 21-March-2016

This file is contains sub routes w.r.t the each
operation which can be performed on a story.
It internally call the static functions written in
Story\BacklogandBuglist\Release Models for different
operations.

****/

var express = require('express');
var router = express.Router();
var story = require('../models/story.js');
var sprint = require('../models/sprint.js');
var backlogsBuglist = require('../models/backlogBuglist.js');
var fs = require('fs'),
    list;

/* GET home page. */
//Merged by Sharan Starts
router.post('/addmember', function(req, res, next) {
  var storyId= req.query.storyid.replace("/","");
  var memberId=req.query.memberid.replace("/","");

story.addMembers(storyId,memberId,function(err,data){
res.send(data);
})
});

router.post('/removemember', function(req, res, next) {
  var storyId= req.query.storyid.replace("/","");
  var memberId=req.query.memberid.replace("/","");

story.removeMembers(storyId,memberId,function(err,data){
  if(err){
    res.send(err);
  }
res.send(data);
})
});

router.post('/addattachments', function(req, res, next) {
  var storyId= req.query.storyid.replace("/","");
  // var storyId= "56ea47bd28c0f3dd0446b660";
  var atachmentObj={
    fileName: "sampleFile",
    timeStamp: Date.now(),
    attachmentType:"pdf",
    addedByUserName:"Sharan",
    addedByUserId:"56ebb688ee6b767262a7ed90",
    path : "../atacments"
  }

story.addAttachments(storyId,atachmentObj,function(err,data){
res.send(data);
})
});

router.post('/removeattachement', function(req, res, next) {
  var storyId= req.query.storyid.replace("/","");
  var attachmentId=req.query.attachmentid.replace("/","");

story.removeAttachment(storyId,attachmentId,function(err,data){
res.send(data);
})
});

router.get('/removechecklistgroup', function(req, res, next) {
  //TODO:Get the below obj dynamically from request. Update indicators dynamically

  var storyId= "56ea47bd28c0f3dd0446b660";
  var checklistId="56efc77c1b9bb26612567c04";
  // var storyId= req.query.storyid.replace("/","");
  // var checklistId=req.query.attachmentid.replace("/","");

story.removeChecklistGroup(storyId,checklistId,function(err,data){
res.send(data);
})
});

router.get('/addchecklistgroup', function(req, res, next) {
  //TODO:Get the below obj dynamically from request. Update indicators dynamically

  // var storyId= req.query.storyid.replace("/","");
  //var checklistObj=req.query.checklistobj;
  var storyId= "56ea47bd28c0f3dd0446b660";
  var checklistObj={
    checklistHeading:"This is Heading of Checklist",
    checkedCount: 2,
    items: [{
      text: "First Check item",
      checked: false,
      createdBy:"56ebb688ee6b767262a7ed90",
      creationDate:Date.now(),
      creatorName:"Sharan"
    },{
      text: "Second Check item",
      checked: false,
      createdBy:"56ebb688ee6b767262a7ed90",
      creationDate:Date.now(),
      creatorName:"Sharan",
    }]

  }
story.addChecklistGroup(storyId,checklistObj,function(err,data){
res.send(data);
});
});

router.post('/updatelabellist', function(req, res, next) {
  //TODO:Get the below obj dynamically from request. Update indicators dynamically
  var storyId= req.query.storyid.replace("/","");
  var labelListId=req.query.labellistid;
  var operation=req.query.operation;

  // var storyId= "56ea47bd28c0f3dd0446b660";
  // var labelListId="56efe6fd6825b2ea15c45f27";
  // var operation= "delete";
story.updateLabelList(storyId,labelListId,operation,function(err,data){
res.send(data);
});
});



//ends
router.get('/', function(req, res, next) {

});

router.post('/delete', function(req, res, next){
  projectId = "56ea78ea15eac2a96fedb5ee";
  sprintId = "56ea89de1d4b0a2572f25b9c";
  listId = "56ea89de1d4b0a2572f25ba0";
  storyId = "56eba38bf44831487912cbd5";
  //res.send(deleteFromSprint(sprintId, listId, storyId));
  //res.send(deleteFromBacklog(projectId, storyId));
  story.deleteStory(storyId, function(err, doc) {
    if(err){
      return(err);
    }
    else {
      res.send(deleteFromSprint(sprintId, listId, storyId));
      return(doc);
    }
  });
});

router.post('/', function(req, res, next){
//TODO: Need to get dynamic data... Structure of stories is updated.
//Please refer to new one and do the required changes.
   var newStory=new story(
     {
       listId:"backlog",
       //storyCreatorId: {type:Schema.Types.ObjectId,ref:'User'},
       storyStatus:"Completed",
       heading: "This story has been created for a story testing purpose",
       description: "This was the description given by the scrum master for the story during story creation",
       descriptionStatus: true,
       timeStamp: Date.now(),
       lastUpdated:Date.now(),
       checklistGroupCount: 3,
       attachmentsCount: 3,
       commentCount: 3,
       labelStatus: 3,
       attachmentList: [{
         fileName: "images/11.jpg",
         timeStamp: Date.now(),
       }],
       checklist: [
         {
           checklistHeading:"Checklist Group",
           checkedCount: 1,
           items: [{
             text: "This is checklist cl1 description",
             checked: true,
           }]
         }
       ]
       //memberList: ["String01","String02"]
       //labelList:[{type:Schema.Types.ObjectId,ref:'Label'}],
     }
     );
     newStory.save(function(err,doc){
       if(err)
       res.send("ERROR-- "+err);
       else {
         projectId = "56ea78ea15eac2a96fedb5ee";//TODO: pass dynamicaly
         sprintId = "56ea89de1d4b0a2572f25b9c";
         listId = "56ea89de1d4b0a2572f25b9f";
         console.log("--------------------------------Adding Story ----" + doc["_id"]);
         //res.send(loadToBuglist(projectId, doc));
         res.send(loadToSprint(sprintId, listId, doc));
       }
     });
});
function loadToBacklog(projectId, doc) {
  backlogsBuglist.addStoryBacklog(projectId, doc["_id"], function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Added");
      return(doc);
    }
  });
}
function deleteFromBacklog(projectId, storyId) {
  backlogsBuglist.deleteStoryBacklog(projectId, storyId, function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Deleted from Backog");
      return(doc);
    }
  });
}
function loadToBuglist(projectId, doc) {
  backlogsBuglist.addStoryBuglist(projectId, doc["_id"], function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Added");
      return(doc);
    }
  });
}
function deleteFromBuglist(projectId, storyId) {
  backlogsBuglist.deleteStoryBuglist(projectId, storyId, function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Added");
      return(doc);
    }
  });
}
function loadToSprint(sprintId, listId, doc) {
  sprint.addStory(sprintId, listId, doc["_id"], function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Added");
      return(doc);
    }
  });
}
function deleteFromSprint(sprintId, listId, storyId) {
  sprint.deleteStory(sprintId, listId, storyId, function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Deleted From Sprint");
      return(doc);
    }
  });
}
module.exports = router;
