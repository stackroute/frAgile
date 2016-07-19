var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personalSchema = new Schema({
subject:[String],
relation:String,
object:String,
projectId:String
});

personalSchema.statics.findMatchedSubject = function(projectId,memberList, callback) {
console.log("MemberList",memberList);
  this.findOne({
      "projectId": projectId,
      "subject": {"$size":2,"$all":memberList}
    })
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
  console.log("in personal doc",doc);
        callback(null, doc);
      }
    });
}

personalSchema.statics.getChannelMembers = function(channelId, callback) {
  this.findOne({
      "object": channelId,
    })
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
  console.log("channel obj",doc);
        callback(null, doc);
      }
    });
}

var Personal = mongoose.model('Personal', personalSchema, 'Personal');
module.exports = Personal;
