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
    //To make sure socket connects to one room only
    if (socket.lastRoom) {
      socket.leave(socket.lastRoom);
      socket.lastRoom = null;
    }
    socket.join(data.room);
    socket.lastRoom = data.room;

    // activity room
    if (data.activityRoom) {
      if (socket.activityRoom) {
        socket.leave(socket.activityRoom);
      }
      socket.join(data.activityRoom);
      socket.activityRoom = data.activityRoom;
    }
  });

  require('../io/project.io.js')(socket, io);
  require('../io/release.io.js')(socket, io);
  require('../io/sprint.io.js')(socket, io);
  require('../io/story.io.js')(socket, io);
  require('../io/activity.io.js')(socket, io);

});


module.exports = io;
