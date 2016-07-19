var Personal=require('../models/personal.js');
var Project=require('../models/project.js')
exports = module.exports = function(socket) {
  var self = this;


  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };



  self.setUser = function(user) {
    self.user = user;
    var subscriber = require('redis').createClient(6379, 'localhost');
    var publisher = require('redis').createClient(6379, 'localhost');
    console.log('Creating publisher');

    publisher.on('publish', function() {
      console.log('Created publisher');
    });

//subscribing all  channels
socket.on('sub',function(data){
subscriber.subscribe(data);
console.log("subscribed to :-----------------------------------------------------------------------------------------------------------------------------------------------------",data);
})

    //generating uuid
    socket.on('subscribe', function(data) {
        var randomTopic=generateUUID();
        data.message.content=randomTopic;
        subscriber.subscribe(data.message.content);
        publisher.publish('uuidGenerator',JSON.stringify(data));
    });

    //sending message
    socket.on('chatMsg',function(data){
      subscriber.subscribe(data.message.content);
      publisher.publish('uuidGenerator',JSON.stringify(data));
    })

    //retrieving history
    socket.on('history',function(data){
      subscriber.subscribe(data.message.content);
      publisher.publish('uuidGenerator',JSON.stringify(data));
    })

    subscriber.on('message', function(channel, message){
        console.log("subscribed to :",channel);
      console.log("Response uuid,",message);
      var message1=JSON.parse(message);
      console.log("command",message1.message.command);
      if(message1.message.command==='generateUUID'){
        //save to db
        console.log(message1.details.projectId);
        if(message1.details.userId!==undefined)
        {
          var members=[message1.details.userId,message1.details.member];

          Personal.create({
            subject: members,
            relation: 'chatOver',
            object:message1.message.content,
            projectId:message1.details.projectId
          }, function(err, data) {
            if(err){
              console.log(err);

            }
            else{console.log(data);}
          });
        }
        else {
          Project.addChannel(message1.message.content,message1.details.projectId,function(err,doc){

          })


        }
      }

      if(message1.message.command==='sendMessage'){
        console.log(message1.message);

        socket.emit('room:chatMessages',message1.message);
      }
      if(message1.message.command==='retrieveHistory'){
        socket.emit('room:chatMessages',message1.message);
      }
    })
  }
}
