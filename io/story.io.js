var Activity = require('../models/activity.js');
var User = require('../models/user.js');
var Project = require('../models/project.js');
var Sprint = require('../models/sprint.js');
var Story = require('../models/story.js');
var BackLogsBugList = require('../models/backlogBuglist.js');
var Template = require('../models/template.js')

module.exports = function(socket, io) {
socket.on('story:removeLabel', function(data) {
  console.log("Received here remove label");
  console.log(data);
Story.removeLabel(data.storyid, data.labelid, function(err, storyData) {
if (!err) {
  io.to(data.room).emit('story:dataModified', storyData);

  var actData = {
    room: "activity:" + data.projectID,
    action: "removed",
    projectID: data.projectID,
    user: data.user,
    object: {
      name: data.colorName,
      type: "Sprint",
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
})
socket.on('story:addLabel', function(data) {
  console.log("Received here add label");
  console.log(data);
  Story.addLabel(data.storyid, data.labelid, function(err, storyData) {
if (!err) {
  io.to(data.room).emit('story:dataModified', storyData);

  var actData = {
    room: "activity:" + data.projectID,
    action: "marked",
    projectID: data.projectID,
    user: data.user,
    target: {
      name: data.colorName,
      type: "Sprint",
      _id: data.storyid
    },
    object: {
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
})
socket.on('story:addNewLabel', function(data) {
  console.log("Received create label");
  console.log(data);
  Template.addNewLabel(data.labelid, data.labelObj, function(err, doc) {
if (!err) {
    data.labelObj._id = data.storyID
    io.to(data.room).emit('story:labelsModified',data.labelObj);
}
  });
})

  /***
  description:listner to add members to story
  ****/
  socket.on('story:addMembers', function(data) {
    Story.addMembers(data.storyid, data.memberid, function(err, doc) {
      if (!err) {
        Story.findById(data.storyid).populate("memberList").exec(function(err, storyData) {
          if (!err) {
            var members = {
              _id: storyData._id,
              memberList: doc.memberList
            }
            console.log("Im in add");
            console.log(members);
            io.to(data.room).emit('story:membersModified', members);
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
            console.log("Im in remove");
            var members = {
              _id: storyData._id,
              memberList: doc.memberList
            }
            io.to(data.room).emit('story:membersModified', members);

            var actData = {
              room: "activity:" + data.projectID,
              action: "removed",
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
              user: data.user,
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
                user: data.user,
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
                user: data.user,
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
                user: data.user,
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
    //start new
    socket.on('story:addRemoveMembersListItem',function(data){
     // console.log(data.roomName);
     Story.addMemberToChecklist(data,function(err,doc)
   {
     console.log("im in story.io");
   })
     console.log("i have reached here");
      console.log("item details ==>",data.storyId,data.checkListId);
      io.to(data.roomName).emit('memberAdded',data);
      console.log("Data member in server: ",data.memberObj);
    });
    //end new
    //start
    //neo
    socket.on('story:addRemoveMembersList',function(data)
    {
      //console.log("My list:",data);
    //Story.addRemoveMembersList(data,function(err,index){

      socket.emit('pushMemberToItem',data.assignedMember);
      //console.log("my data members: ",data.assignedMember);


    });
    //end
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
   //
    Story.getCheckItemIndex(data.itemid, function(err, index) {
      if (index !=-1)
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
                  user: data.user,
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

    var actData = {
      room: "activity:" + data.projectID,
      action: "attached",
      projectID: data.projectID,
      user: data.user,
      object: {
        name: data.type,
        type: "Story",
        _id: data._id
      },
      target: {
        name: data.heading,
        type: "Story",
        _id: data._id
      }
    }
    Activity.addEvent(actData, function(data) {
      io.to(actData.room).emit('activityAdded', data);
    });
  });

  socket.on('story:removeAttachment', function(data) {
    io.to(data.room).emit('story:attachmentRemoved', data);

    var actData = {
      room: "activity:" + data.projectID,
      action: "removed",
      projectID: data.projectID,
      user: data.user,
      object: {
        name: data.type,
        type: "Story",
        _id: data._id
      },
      target: {
        name: data.heading,
        type: "Story",
        _id: data._id
      }
    }
    Activity.addEvent(actData, function(data) {
      io.to(actData.room).emit('activityAdded', data);
    });
  });
  socket.on('story:addComment', function(data) {
    var commentsObj = {};
    commentsObj['text'] = data.text;
    commentsObj['commentedBy'] = user._id;
    commentsObj['userName'] = user.fullName;;
    commentsObj['commentedDate'] = Date.now();
    Story.addComment(data.storyId, commentsObj, function(err, storyData) {
      if (!err) {
        io.to(data.room).emit('story:dataModified', storyData);

        var actData = {
          room: "activity:" + data.projectID,
          action: "commented",
          projectID: data.projectID,
          user: data.user,
          target: {
            name: storyData.heading,
            type: "Story",
            _id: data.storyId
          }
        }
        Activity.addEvent(actData, function(data) {
          io.to(actData.room).emit('activityAdded', data);
        });
      }
    });
  });
  socket.on('story:deleteComment', function(data) {
    Story.deleteComment(data.storyId, data.commentId, index, function(err, storyData) {
      if (!err) {
        io.to(data.room).emit('story:dataModified', storyData);

        var actData = {
          room: "activity:" + data.projectID,
          action: "commented",
          projectID: data.projectID,
          user: data.user,
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
  });
}
