var Activity = require('../models/activity.js');
var User = require('../models/user.js');
var Project = require('../models/project.js');
var Sprint = require('../models/sprint.js');
var Story = require('../models/story.js');
var BackLogsBugList = require('../models/backlogBuglist.js');
var Template = require('../models/template.js');
var queue= require('../redis/queue.js');
var GithubRepo = require('../models/githubRepo.js');
var io= require("../io/io.js");

module.exports=
{

addMember:function(data)
{
  Story.addMembers(data.storyid, data.memberid, function(err, doc) {

    //edited for cards page
    console.log(data.memberid+ "new member added");
    console.log(doc);

    if (!err) {
      console.log(data.memberid);

      Story.findById(data.storyid).exec(function(err, storyData) {
        if (!err) {
          var members = {
            _id: storyData._id,
            memberList: doc.memberList
          }
          console.log("Im in add");

          console.log(members);
          io.to(data.room).emit('story:membersModified',members);
          io.to(data.room).emit('story:membersModifiedOnItem',{"storyId":storyData._id,"memberList":storyData.memberList});

          io.to(data.room).emit('story:dataModified', storyData);


          var actData = {
            room: "activity:" + data.projectID,
            action: "added",
            projectID: data.projectID,
            user: data.user,
            object: {
              name: data.fullName,
              type: "User",
              _id: data.memberid
            },
            target: {
              name: storyData.heading,
              type: "Story",
              _id: storyData._id
            }
          }
          Activity.addEvent(actData, function(data) {
console.log("on add members in activity"+actData.room);
console.log(data);
            io.to(actData.room).emit('activityAdded', data);
          });
        }
      });
    }
  })

  User.addAssignedStories(data, function(err, doc) {
  console.log("------doc after adding members------");
  console.log(doc[0].assignedStories);
    io.to(data.memberid).emit('story:memberAssigned',doc);
   })
}

//Updating the user schema ehen a member is added for cards



}
