var app = require('../app.js')
var io = require('socket.io')();

var Activity = require('../models/activity.js');
var User = require('../models/user.js');
var Project = require('../models/project.js');
var Sprint = require('../models/sprint.js');
var Story = require('../models/story.js');
var BackLogsBugList = require('../models/backlogBuglist.js');

io.on('connection', function(socket) {

  socket.on('join:room', function(data) {
    console.log(" Joining room :",data);
    //To make sure socket connects to one room only
    if (socket.lastRoom) {
  console.log("leaving room"+socket.lastRoom);
      socket.leave(socket.lastRoom);
      socket.lastRoom = null;
    }
  console.log("joining "+data.room);
    socket.join(data.room);
    socket.lastRoom = data.room;

    // activity room
    if (data.activityRoom) {
console.log("leaving activity room"+socket.activityRoom);
      if (socket.activityRoom) {
        socket.leave(socket.activityRoom);
      }

      console.log("activity room"+data.activityRoom);

      socket.join(data.activityRoom);
      socket.activityRoom = data.activityRoom;
    }
    if(data.BacklogRoom){
      if(socket.BacklogRoom){
        socket.leave(socket.BacklogRoom)
      }
      console.log("BacklogRoom",data.BacklogRoom);
      socket.join(data.BacklogRoom);
      socket.BacklogRoom=data.BacklogRoom;
    }
  });

  require('../io/project.io.js')(socket, io);
  require('../io/release.io.js')(socket, io);
  require('../io/sprint.io.js')(socket, io);
  require('../io/story.io.js')(socket, io);
  require('../io/activity.io.js')(socket, io);
  require('../io/github.io.js')(socket,io);
});


module.exports = io;
