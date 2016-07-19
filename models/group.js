var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
  groupName:String,
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  channelId:String,
  members:[String]
});


var Group = mongoose.model('Group', groupShema, 'Groups');
module.exports = Group;
