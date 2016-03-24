var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var activitySchema = new mongoose.Schema({
  action: String,
  projectID: String, //TODO: change to ObjectId
  date: Date,
  userCreator: {
    fullName: String,
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  object: {
    name: String,
    kind: String,
    _id: {
      type: Schema.Types.ObjectId,
      refPath: 'object.kind'
    }
  },
  target: {
    name: String,
    kind: String,
    _id: {
      type: Schema.Types.ObjectId,
      refPath: 'target.kind'
    }
  }
});

activitySchema.statics.addEvent = function(event, callback) {
  if (event.object == undefined)
    event.object = {};
  return this.create({
    action: event.action,
    projectID: event.projectID,
    userCreator: {
      fullName: event.user.fullName,
      _id: event.user._id
    },
    target: {
      name: event.target.name,
      kind: event.target.type,
      _id: event.target._id
    },
    object: {
      name: event.object.name,
      kind: event.object.type,
      _id: event.object._id
    },
    date: Date.now()
  },callback(err,data));
}

activitySchema.statics.findEventsbyStory = function(storyID, callback) {
  return this.find({
    $or: [{
      'target._id': storyID
    }, {
      'object._id': storyID
    }]
  }).sort({'date': -1}).exec(function(err, data) {
    if(err) callback(err)
    else callback(data);
  });
}

activitySchema.statics.findEventsbyProject = function(projectID, callback) {
  return this.find({'projectID':projectID}).sort({'date': -1}).exec(function(err, data) {
    if(err) callback(err)
    else callback(data);
  });
}



module.exports = mongoose.model('Activity', activitySchema, 'activity');
