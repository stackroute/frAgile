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
// groupSchema.statics.addGroup=function(projMembers,channelId,callback)
// {
// this.({
//   "_id":projectId
// }).exec(function(err,data)
// {
//   if(!err)
//   callback(null,data);
// })
//
// }

var Group = mongoose.model('Group', groupSchema, 'Groups');
module.exports = Group;
