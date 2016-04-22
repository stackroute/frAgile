var Activity = require('../models/activity.js');
var User = require('../models/user.js');
var Project = require('../models/project.js');
var Sprint = require('../models/sprint.js');
var Story = require('../models/story.js');
var BackLogsBugList = require('../models/backlogBuglist.js');

module.exports = function(socket, io, user) {


  /***
  description:listner to add members to story
  ****/
  socket.on('story:addMembers', function(data) {
    Story.addMembers(data.storyid, data.memberid, function(err, doc) {
      if (!err) {
        Story.findById(data.storyid).populate("memberList").exec(function(err, storyData) {
          if (!err) {
            io.to(data.room).emit('story:dataModified', storyData);

            var actData = {
              room: "activity:" + data.projectID,
              action: "added",
              projectID: data.projectID,
              user: user,
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
              io.to(actData.room).emit('activityAdded', data);
            });
          }
        });
      }
    })
  })

  /****
  description:listner to remove members from story
  ****/
  socket.on('story:removeMembers', function(data) {
    Story.removeMembers(data.storyid, data.memberid, function(err, doc) {
      if (!err) {
        Story.findById(data.storyid).populate("memberList").exec(function(err, storyData) {
          if (!err) {
            io.to(data.room).emit('story:dataModified', storyData);

            var actData = {
              room: "activity:" + data.projectID,
              action: "removed",
              projectID: data.projectID,
              user: user,
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
              io.to(actData.room).emit('activityAdded', data);
            });
          }
        });
      }
    })
  })

  /****
  description:listner to addnew checklist group to story
  ****/
  socket.on('story:addChecklistGroup', function(data) {
    Story.addChecklistGroup(data.storyid, data.checklistGrp, function(err, doc) {
      if (!err) {
        Story.findById(data.storyid).populate("memberList").exec(function(err, storyData) {
          if (!err) {
            io.to(data.room).emit('story:dataModified', storyData);

            var actData = {
              room: "activity:" + data.projectID,
              action: "added",
              projectID: data.projectID,
              user: user,
              object: {
                name: data.checklistGrp.checklistHeading,
                type: "Story",
                _id: data.storyid
              },
              target: {
                name: storyData.heading,
                type: "Story",
                _id: data.storyid
              }
            }
            Activity.addEvent(actData, function(data) {
              io.to(actData.room).emit('activityAdded', data);
            });
          }
        });
      }
    })
  })

  /****
  description:listner to addnew item to checklist group in a story
  ****/
  socket.on('story:addChecklistItem', function(data) {
      data.itemObj.creatorName = user.fullName;
      data.itemObj.createdBy = user._id;
      // data.itemObj.createdBy="570395a239dc5fbac028505c";
      // data.itemObj.creatorName="user.fullName";

      Story.addChecklistItem(data.storyid, data.checklistGrpId, data.itemObj, function(err, doc) {
        if (!err) {
          Story.findById(data.storyid).populate("memberList").exec(function(err, storyData) {
            if (!err) {
              io.to(data.room).emit('story:dataModified', storyData);

              var actData = {
                room: "activity:" + data.projectID,
                action: "added",
                projectID: data.projectID,
                user: user,
                object: {
                  name: data.text,
                  type: "Story",
                  _id: data.checklistGrpId
                },
                target: {
                  name: storyData.heading,
                  type: "Story",
                  _id: data.storyid
                }
              }
              Activity.addEvent(actData, function(data) {
                io.to(actData.room).emit('activityAdded', data);
              });
            }
          });
        }
      })
    })
    /****
    description:listner to remove item to checklist group in a story
    ****/
  socket.on('story:removeChecklistItem', function(data) {
      Story.removeChecklistItem(data.storyid, data.checklistGrpId, data.itemid, data.checked, function(err, doc) {
        if (!err) {
          //user.userID
          Story.findById(data.storyid).populate("memberList").exec(function(err, storyData) {
            if (!err) {
              io.to(data.room).emit('story:dataModified', storyData);

              var actData = {
                room: "activity:" + data.projectID,
                action: "added",
                projectID: data.projectID,
                user: user,
                object: {
                  name: data.text,
                  type: "Story",
                  _id: data.checklistGrpId
                },
                target: {
                  name: storyData.heading,
                  type: "Story",
                  _id: data.storyid
                }
              }
              Activity.addEvent(actData, function(data) {
                io.to(actData.room).emit('activityAdded', data);
              });
            }
          });
        }
      })
    })
    /****
    description:listner to remove item to checklist group in a story
    ****/
  socket.on('story:removeChecklistGroup', function(data) {
      Story.removeChecklistGroup(data.storyid, data.checklistGrpId, function(err, doc) {
        if (!err) {
          //user.userID
          Story.findById(data.storyid).populate("memberList").exec(function(err, storyData) {
            if (!err) {
              io.to(data.room).emit('story:dataModified', storyData);

              var actData = {
                room: "activity:" + data.projectID,
                action: "removed",
                projectID: data.projectID,
                user: user,
                object: {
                  name: data.heading,
                  type: "Story",
                  _id: data.checklistGrpId
                },
                target: {
                  name: storyData.heading,
                  type: "Story",
                  _id: data.storyid
                }
              }
              Activity.addEvent(actData, function(data) {
                io.to(actData.room).emit('activityAdded', data);
              });
            }
          });
        }
      })
    })
    /****
    description:listner to update item to checklist group in a story
    ****/
  socket.on('story:updateChecklistItem', function(data) {

    // Story.updateChecklistItem(data.storyid,data.checklistGrpId,data.itemid,data.checked, function(err, doc) {
    //   if (!err) {
    //     //user.userID
    //     io.to(data.room).emit('story:checklistItemUpdated', doc);
    //   }
    // })
    Story.getCheckItemIndex(data.itemid, function(err, index) {
      if (index != -1)
        Story.updateChecklistItem(data.storyid, data.checklistGrpId, data.itemid, data.checked, index, function(err, doc) {
          if (!err) {
            //user.userID
            Story.findById(data.storyid).populate("memberList").exec(function(err, storyData) {
              if (!err) {
                io.to(data.room).emit('story:dataModified', storyData);

                var actData = {
                  room: "activity:" + data.projectID,
                  action: data.checked == true ? "completed" : "unchecked",
                  projectID: data.projectID,
                  user: user,
                  object: {
                    name: data.text,
                    type: "Story",
                    _id: data.checklistGrpId
                  },
                  target: {
                    name: storyData.heading,
                    type: "Story",
                    _id: data.storyid
                  }
                }
                Activity.addEvent(actData, function(data) {
                  io.to(actData.room).emit('activityAdded', data);
                });
              }
            });
          }
        })
    })
  })

  socket.on('story:addAttachment', function(data) {
    io.to(data.room).emit('story:attachmentAdded', data);
  });

  socket.on('story:removeAttachment', function(data) {
    io.to(data.room).emit('story:attachmentRemoved', data);
  });

}
