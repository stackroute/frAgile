var Activity = require('../models/activity.js');
var User = require('../models/user.js');
var Project = require('../models/project.js');
var Sprint = require('../models/sprint.js');
var Story = require('../models/story.js');
var BackLogsBugList = require('../models/backlogBuglist.js');

module.exports = function(socket, io, user) {

  socket.on('addActivity', function(data) {
    data.user = user;
    Activity.addEvent(data, function(actData) {
      io.to(data.room).emit('activityAdded', actData);
    });
  });

  socket.on('activity:addMember', function(data) {
    //Pushing the members in project
    Project.addMember(data.projectId, data.memberList, function(err, doc) {
      if (!err && doc.nModified != 0) {
        data.memberList.forEach(function(memberId) {
          User.find({
            '_id': memberId
          }).exec(function(err, userData) {
            if (!err){
              io.to(data.room).emit('activity:memberAdded', userData[0]);

                var actData = {
                  room: 'activity:' +data.projectId,
                  action: "added",
                  projectID: data.projectId,
                  user: user,
                  object: {
                    name: userData[0].firstName +  " " + userData[0].lastName,
                    type: "User",
                    _id: userData[0]._id
                  },
                  target: {
                    name: data.projectName,
                    type: "Project",
                    _id: data.projectId
                  }
                }
                Activity.addEvent(actData, function(callbackData) {
                  io.to(actData.room).emit('activityAdded', callbackData);
                });
            }
            else{
              io.to(data.room).emit('activity:addMemberFailed', "Adding user failed");
            }
          });
          //Pushing project in the User Collection
          User.addProjectToUser(memberId, data.projectId, function(subdoc) {
            //Loading the project and sending it to the user.
            Project.findById(data.projectId).exec(function(err, projectsData) {
              if (!err){
                io.to("user:" + memberId).emit('project:projectAdded', projectsData);
              }
            });
          });
        }); //For loop end
      }
      else {
        io.to(data.room).emit('activity:addMemberFailed', "User already exists");
      }
    })
  });

  socket.on('activity:removeMember', function(data) {
    Project.removeMember(data.projectId, data.memberId, function(err, doc) {
      if (!err) {
        User.find({
          '_id': data.memberId
        }).exec(function(err, userData) {
          if (!err)
            io.to(data.room).emit('activity:memberRemoved', userData[0]);
          User.removeProjectfromUser(data.memberId, data.projectId, function(subDoc) {
            var actData = {
              room: data.room,
              action: "removed",
              projectID: data.projectId,
              user: user,
              object: {
                name: userData[0].firstName + " " + userData[0].lastName,
                type: "User",
                _id: data.memberId
              },
              target: {
                name: doc.name,
                type: "Project",
                _id: data.projectId
              }
            }
            Activity.addEvent(actData, function(data) {
              io.to(actData.room).emit('activityAdded', data);
            });
          });
        });

      }
    })
  });

}
