var io = require('socket.io')();

var Activity = require('./models/activity.js');
var User = require('./models/user.js');
var Project = require('./models/project.js');
var Sprint = require('./models/sprint.js');
var Story = require('./models/story.js');
var BackLogsBugList = require('./models/backlogBuglist.js');


var app = require('./app.js')

io.on('connection', function(socket) {
  var user = {
    _id:app.userID,
    fullName:app.fullName
  }
  socket.on('join:room', function(data) {
    //To make sure socket connects to one room only
    if (socket.lastRoom) {
      socket.leave(socket.lastRoom);
      //console.log("Left room " + socket.lastRoom);
      socket.lastRoom = null;
    }
    socket.join(data.room);
    //console.log("Joined room " + data.room);
    socket.lastRoom = data.room;
    // console.log("Joined " + socket.lastRoom);

    if (data.activityRoom) {
      if (socket.activityRoom) {
        socket.leave(socket.activityRoom);
      }
      socket.join(data.activityRoom);
      socket.activityRoom = data.activityRoom;
    }
  });


  socket.on('project:addRelease', function(data) {
    release = {
      name: data.name,
      description: data.desc,
      creationDate: Date.now(),
      releaseDate: data.dt
    };
    Project.addRelease(data.projectID, release, function(err, doc) {
      if (!err) {
        io.to(data.room).emit('project:releaseAdded', doc);

        var actData = {
          room: "activity:" + data.projectID,
          action: "added",
          projectID: data.projectID,
          user: user,
          object: {
            name: data.name,
            type: "Release",
            _id: doc._id
          },
          target: {
            name: doc.name,
            type: "Project",
            _id: doc._id
          }
        }
        Activity.addEvent(actData, function(data) {
          io.to(actData.room).emit('activityAdded', data);
        });
      }
    });

  });

  socket.on('project:editRelease', function(data) {
    release = {
      name: data.name,
      description: data.description,
      creationDate: data.creationDate,
      releaseDate: data.releaseDate
    };
    console.log("--------------------------");
    console.log(release);
    console.log("--------------------------");
    Project.updateRelease(data.projectId, data.releaseId, release, function(err, doc) {
      if (!err) {
        release._id = data.releaseId;
        release.prId = data.projectId;
        io.to(data.room).emit('project:releaseEdited', release);
      }
    });

  });
  socket.on('release:editSprint', function(data) {
    sprint = {
      name: data.name,
      endDate: data.endDate,
      startDate: data.startDate,
      description: data.description,
    };
    console.log("--------------------------");
    console.log(sprint);
    console.log("--------------------------");
    Sprint.updateSprint(data.sprintId, sprint, function(err, doc) {
      if (!err) {
        sprint._id=data.sprintId;
        io.to(data.room).emit('release:sprintEdited', sprint);
      }
    });

  });

  socket.on('release:addSprint', function(data) {
    var sprint = {
      name: data.name,
      endDate: data.endDate,
      startDate: data.startDate,
      desc: data.desc,
      list: data.list

    }
    Sprint.addSprint(sprint, function(err, doc) {
      if (!err) {
        Project.addSprint(data.projectId, data.releaseId, doc, function(err, subDoc) {
          if (!err) {
            io.to(data.room).emit('release:sprintAdded', doc);

            var actData = {
              room: 'activity:' + data.projectId,
              action: "added",
              projectID: data.projectId,
              user: user,
              object: {
                name: data.name,
                type: "Sprint",
                _id: doc._id
              },
              target: {
                name: data.releaseName,
                type: "Release",
                _id: subDoc._id
              }
            }
            Activity.addEvent(actData, function(data) {
              io.to(actData.room).emit('activityAdded', data);
            });
          } else
            console.log(err);
        });
      } else
        console.log(err);
    })
  });

  socket.on('sprint:moveStory', function(data) {

    //Adding story in new list, then deleting from old list

    Sprint.addStory(data.sprintId, data.newListId, data.storyId, function(err, addStoryData) {
      if (addStoryData.nModified == 1) { //If add is succesful
        Sprint.deleteStory(data.sprintId, data.oldListId, data.storyId, function(err, delStoryData) {
          if (delStoryData.nModified == 1) { //If delete is succesful
            Story.findById(data.storyId, function(err, storyData) {
              data.story = storyData;
              io.to(data.room).emit('sprint:storyMoved', data);
              socket.emit('sprint:storyActivity', data)
            });
          } else { //reverting changes
            console.log("Couldn't delete story", socket.id);
            Sprint.deleteStory(data.sprintId, data.newListId, data.storyId, function(err, delStoryData) {
              if (err) console.log("Duplicate story created ", data.storyId);
              else {
                console.log("Deleted previously added story", socket.id);
              }

            });
          }
        })
      }
    });


  });

  socket.on('sprint:moveToBackbugStory', function(data) {
    //Adding story in new list, then deleting from old list
    if (data.newListId == "backlogs") {

      BackLogsBugList.addStoryBacklog(data.projectID, data.storyId, function(err, addStoryData) {
        if (addStoryData.nModified == 1) { //If add is succesful
          Sprint.deleteStory(data.sprintId, data.oldListId, data.storyId, function(err, delStoryData) {
            if (delStoryData.nModified == 1) { //If delete is succesful
              Story.findById(data.storyId, function(err, storyData) {
                data.story = storyData;
                io.to(data.room).emit('sprint:backbugStoryMovedTo', data);
                socket.emit('sprint:storyActivity', data)

              });
            } else { //reverting changes
              console.log("Couldn't delete story", socket.id);
              BackLogsBugList.deleteStoryBacklog(data.projectID, data.storyId, function(err, delStoryData) {
                if (err) console.log("Duplicate story created ", data.storyId);
                else {
                  console.log("Deleted previously added story", socket.id);
                }

              });
            }
          })
        }
      });


    } else if (data.newListId == "buglists") {

      BackLogsBugList.addStoryBuglist(data.projectID, data.storyId, function(err, addStoryData) {
        if (addStoryData.nModified == 1) { //If add is succesful
          Sprint.deleteStory(data.sprintId, data.oldListId, data.storyId, function(err, delStoryData) {
            if (delStoryData.nModified == 1) { //If delete is succesful
              Story.findById(data.storyId, function(err, storyData) {
                data.story = storyData;
                io.to(data.room).emit('sprint:backbugStoryMovedTo', data);
                socket.emit('sprint:storyActivity', data)

              });
            } else { //reverting changes
              console.log("Couldn't delete story", socket.id);
              BackLogsBugList.deleteStoryBuglist(data.projectID, data.storyId, function(err, delStoryData) {
                if (err) console.log("Duplicate story created ", data.storyId);
                else {
                  console.log("Deleted previously added story", socket.id);
                }

              });
            }
          })
        }
      });

    }
  });

  socket.on('sprint:moveFromBackbugStory', function(data) {
    if (data.oldListId == "backlogs") {

      Sprint.addStory(data.sprintId, data.newListId, data.storyId, function(err, addStoryData) {
        if (addStoryData.nModified == 1) { //If add is succesful
          BackLogsBugList.deleteStoryBacklog(data.projectID, data.storyId, function(err, delStoryData) {
            if (delStoryData.nModified == 1) { //If delete is succesful
              Story.findById(data.storyId, function(err, storyData) {
                data.story = storyData;
                io.to(data.room).emit('sprint:backbugStoryMovedFrom', data);
                socket.emit('sprint:storyActivity', data)

              });
            } else { //reverting changes
              console.log("Couldn't delete story", socket.id);
              Sprint.deleteStory(data.sprintId, data.newListId, data.storyId, function(err, delStoryData) {
                if (err) console.log("Duplicate story created ", data.storyId);
                else {
                  console.log("Deleted previously added story", socket.id);
                }

              });
            }
          })
        }
      });
    }
    else if(data.oldListId == "buglists"){
      Sprint.addStory(data.sprintId, data.newListId, data.storyId, function(err, addStoryData) {
        if (addStoryData.nModified == 1) { //If add is succesful
          BackLogsBugList.deleteStoryBuglist(data.projectID, data.storyId, function(err, delStoryData) {
            if (delStoryData.nModified == 1) { //If delete is succesful
              Story.findById(data.storyId, function(err, storyData) {
                data.story = storyData;
                io.to(data.room).emit('sprint:backbugStoryMovedFrom', data);
                socket.emit('sprint:storyActivity', data)

              });
            } else { //reverting changes
              console.log("Couldn't delete story", socket.id);
              Sprint.deleteStory(data.sprintId, data.newListId, data.storyId, function(err, delStoryData) {
                if (err) console.log("Duplicate story created ", data.storyId);
                else {
                  console.log("Deleted previously added story", socket.id);
                }

              });
            }
          })
        }
      });
    }
  })

  socket.on('sprint:deleteStory', function(data) {
    console.log("-------------------------Inside io.js");
    Story.deleteStory(data.storyId, function(err, delData) {
      if (!err) {
        console.log("-------------------------Story Deleted");
        var error = false;
        if (data.deleteFrom == 'Backlog') {
          BackLogsBugList.deleteStoryBacklog(data.projectId,data.storyId, function(err, delDataFrom) {
            error = err;
          });
        }
        if (data.deleteFrom == 'Buglist') {
          BackLogsBugList.deleteStoryBuglist(data.projectId,data.storyId, function(err, delDataFrom) {
            error = err;
          });
        }
        if (data.deleteFrom == 'List') {
          Sprint.deleteStory(data.sprintId,data.Listid,data.storyId, function(err, delDataFrom) {
            error = err;
          });
        }

        if (!error) {
          console.log("-------------------------Story Refference Deleted");
          var storyData = {
            'deleteFrom': data.deleteFrom,
            'storyId':data.storyId,
            'projectId': data.projectId,
            'Listid': data.Listid,
            'sprintId': data.sprintId
          };
          io.to(data.room).emit('sprint:storyDeleted', storyData);
        }
      }
    });

  });

  socket.on('sprint:addStory', function(data) {
    var story = {
      heading: data.heading,
      addTo: data.addTo,
      storyStatus: data.storyStatus,
      heading: data.heading,
      description: data.description,
      listId: data.listId
    }
    Story.addStory(story, function(err, storyData) {
      if (!err) {
        var actData = {
          room: data.activityRoom,
          action: "added",
          projectID: data.projectId,
          user: user,
          object: {
            name: data.heading,
            type: "Story",
            _id: ""
          },
          target: {
            name: data.listName,
            type: "List",
            _id: data.id
          }
        }

        if (data.addTo == "Backlogs") {
          BackLogsBugList.addStoryBacklog(data.projectId, storyData._id, function(err, subDoc) {
            if (!err) {
              io.to(data.room).emit('sprint:storyAdded', storyData);
              actData.object._id = storyData._id;
              Activity.addEvent(actData, function(data) {
                io.to(data.activityRoom).emit('activityAdded', data);
              });

            } else
              console.log(err);
          })
        } else if (data.addTo == "BugLists") {
          BackLogsBugList.addStoryBuglist(data.projectId, storyData._id, function(err, subDoc) {
            if (!err) {
              io.to(data.room).emit('sprint:storyAdded', storyData);
              actData.object._id = storyData._id
              Activity.addEvent(actData, function(data) {
                io.to(data.activityRoom).emit('activityAdded', data);
              });

            } else
              console.log(err);
          })
        } else {
          Sprint.addStory(data.sprintId, data.id, storyData._id, function(err, subDoc) {
            if (!err) {

              actData.object._id = storyData._id

              //FIXME: Not able to add new property to storyData :(
              //storyData.listIdAdded = data.id;
              //console.log(storyData);
               storyData.listId = data.id

              io.to(data.room).emit('sprint:storyAdded', storyData);

              Activity.addEvent(actData, function(data) {
                io.to(actData.room).emit('activityAdded', data);
              });

            } else
              console.log(err);
          })
        }


      } else
        console.log(err);



    });

  });

  socket.on('addActivity', function(data) {
    data.user = user;
    Activity.addEvent(data, function(actData) {
      io.to(data.room).emit('activityAdded', actData);
    });
  });

  socket.on('deleteRelease', function(data) {
    Project.deleteRelease(data.projectId, data.releaseId, function(err, doc) {
      if (!err) {

        io.to(data.room).emit('releaseDeleted', {
          projectId: data.projectId,
          releaseId: data.releaseId
        });

        var actData = {
          room: data.activityRoom,
          action: "deleted",
          projectID: data.projectId,
          user: user,
          object: {
            name: data.releaseName,
            type: "Release",
            _id: data.releaseId
          },
          target: {
            name: data.projectName,
            type: "Project",
            _id: data.projectId
          }
        }
        Activity.addEvent(actData, function(data) {
          io.to(actData.room).emit('activityAdded', data);
        });
      }

    });



  });

  socket.on('deleteSprint', function(data) {
    Project.deleteSprint(data.projectId, data.releaseId, data.sprintId, function(err, doc) {
      if (!err)
        io.to(data.room).emit('sprintDeleted', {
          projectId: data.projectId,
          releaseId: data.releaseId,
          sprintId: data.sprintId
        });
      console.log('Delete Sprint: ', doc);
    })
  })

socket.on('activity:addMember', function(data) {
    Project.addMember(data.projectId, data.memberList, function(err, doc) {
      if (!err) {
        data.memberList.forEach(function(memberId){
          User.find({'_id': memberId}).exec(function(err, userData){
            if(!err)
            io.to(data.room).emit('activity:memberAdded', userData[0]);
          });
          User.addProjectToUser(memberId,data.projectId,function(data){

          });
        })
      }
    })
  })

  socket.on('activity:removeMember', function(data) {
    console.log('Remove Member: Socket Request');
    Project.removeMember(data.projectId, data.memberId, function(err, doc) {
      if (!err) {
        User.find({'_id': data.memberId}).exec(function(err, userData){
          if(!err)
            io.to(data.room).emit('activity:memberRemoved', userData[0]);
        });
        User.removeProjectfromUser(data.memberId,data.projectId,function(data){
        });
      }
    })
  })

});


module.exports = io;
