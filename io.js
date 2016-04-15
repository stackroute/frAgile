var io = require('socket.io')();

var Activity = require('./models/activity.js');
var User = require('./models/user.js');
var Project = require('./models/project.js');
var Sprint = require('./models/sprint.js');
var Story = require('./models/story.js');
var BackLogsBugList = require('./models/backlogBuglist.js');

io.on('connection', function(socket) {

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


    //Leave the previously connected activity room
    if (socket.activityRoom) {
      socket.leave(socket.activityRoom);
      // console.log("Left " + socket.activityRoom);
      socket.activityRoom = null;
    }

    //Join the current activity room
    if (data.activityRoom) {
      // console.log("Joined " + data.activityRoom);
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
          } else
            console.log(err);
        })
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
              data.success = true;
              socket.broadcast.to(data.room).emit('sprint:storyMoved', data);
            });
          } else {
            console.log("Couldn't delete story", socket.id);
            //roll back changes
            Sprint.deleteStory(data.sprintId, data.newListId, data.storyId, function(err, delStoryData) {
              if (err) console.log("Duplicate story created");
              else {
                console.log("Deleted previously added story",socket.id);
                Story.findById(data.storyId, function(err, storyData) {
                  data.story = storyData
                  data.success = false
                  socket.emit('sprint:storyMoved', data);
                });
              }

            });
          }
        })
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
    Story.addStory(story, function(err, doc) {
      if (!err) {
        if (data.addTo == "Backlogs") {
          BackLogsBugList.addStoryBacklog(data.projectId, doc._id, function(err, subDoc) {
            if (!err) {
              io.to(data.room).emit('sprint:storyAdded', doc);
            } else
              console.log(err);
          })
        } else if (data.addTo == "BugLists") {
          BackLogsBugList.addStoryBuglist(data.projectId, doc._id, function(err, subDoc) {
            if (!err) {
              io.to(data.room).emit('sprint:storyAdded', doc);
            } else
              console.log(err);
          })
        } else {
          Sprint.addStory(data.sprintId, data.id, doc._id, function(err, subDoc) {
            if (!err) {

              //TODO: Fix this :(
              // doc.idNew = data.id;
              // console.log(doc.idNew);
              // console.log(doc);

              doc._id = data.id
              io.to(data.room).emit('sprint:storyAdded', doc);
            } else
              console.log(err);
          })
        }
      } else
        console.log(err);
    })
  });

  socket.on('addActivity', function(data) {
    Activity.addEvent(data, function(actData) {
      io.to(data.room).emit('activityAdded', actData);
    });
  });

  socket.on('deleteRelease', function(data) {
    Project.deleteRelease(data.projectId, data.releaseId, function(err, doc) {
      if (!err)
        io.to(data.room).emit('releaseDeleted', {
          projectId: data.projectId,
          releaseId: data.releaseId
        });
    })
  })

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
        io.to(data.room).emit('activity:memberAdded', 1);
        console.log(doc);
      }
    })
  })

});

module.exports = io;
