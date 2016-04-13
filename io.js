var io = require('socket.io')();

var Activity = require('./models/activity.js');
var User = require('./models/user.js');
var Project = require('./models/project.js');
var Sprint = require('./models/sprint.js');
var backLogsBugList = require('./models/backlogBuglist.js');

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
  });


	socket.on('project:add release',function(data){
    release = {
      name: data.name,
      description: data.desc,
      creationDate: Date.now(),
      releaseDate: data.dt
    };
		Project.addRelease(data.projectID, release, function(err, doc) {
		  if (!err){
				io.to(data.room).emit('project:release added', doc);
		  }
		});

	});

  socket.on('sprintAdded', function(data) {
    console.log('Add Sprint: Socket Request');
    var sprint = {
      name: data.name,
      endDate: data.endDate,
      startDate: data.startDate,
      desc: data.desc
    }
    Sprint.addSprint(sprint, function(err, doc) {
      if (!err) {
        Project.addSprint(data.projectId, data.releaseId, doc, function(err, subDoc) {
          if (!err)
            io.to(data.room).emit('sprintAdded', doc);
          else
            console.log(err);
        })
      }
        else
          console.log(err);
    })
  });

});

module.exports = io;
