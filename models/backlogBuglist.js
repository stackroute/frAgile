var mongoose = require('mongoose');
var Schema = mongoose.Schema;
backlogBuglistSchema = new Schema({
projectId: {type : Schema.ObjectId, ref : "Project"},
backlogs: {
  listName: String,
  stories: [{type : Schema.ObjectId, ref : 'Story'}],
},
buglist: {
  listName: String,
  stories: [{type : Schema.ObjectId, ref : 'Story'}],
}
});

backlogBuglistSchema.statics.addStoryBacklog = function(projectId, storyId, callback) {
  console.log("-------------------------------projectId: " + projectId);
  this.update(
      { "projectId" : projectId },
      { $push: { "backlogs.stories" : storyId
        }
      },
      {
         upsert: true
      }
   )
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       callback(null, doc);
     }
   });
}

backlogBuglistSchema.statics.findList = function(projectId, callback) {
  console.log("----------------------------Inside BackBug Model");
  this.findOne({ 'projectId' : projectId })
  .populate("backlogs.stories", "storyStatus heading descriptionStatus checklistGroupCount attachmentsCount commentCount")
  .populate("backlogs.stories", "storyStatus heading descriptionStatus checklistGroupCount attachmentsCount commentCount")
   .exec(function(err , doc) {
     if (err) {
       console.log("+++++++++++++++++++++++++++++++++IF");
       callback(err, null);
     }
     else {
       console.log("+++++++++++++++++++++++++++++++++ELSE");
       callback(null, doc);
     }
   });
}

backlogBuglistSchema.statics.deleteStoryBacklog = function(projectId, storyId, callback) {
  console.log("-------------------------------to delete in projectId: " + projectId);
  this.update(
      { "projectId" : projectId },
      { $pull: { "backlogs.stories" : storyId
        }
      },
      {
         upsert: true
      }
   )
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       callback(null, doc);
     }
   });
}

backlogBuglistSchema.statics.deleteStoryBuglist = function(projectId, storyId, callback) {
  console.log("-------------------------------to delete in projectId: " + projectId);
  this.update(
      { "projectId" : projectId },
      { $pull: { "buglist.stories" : storyId
        }
      },
      {
         upsert: true
      }
   )
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       callback(null, doc);
     }
   });
}

backlogBuglistSchema.statics.addStoryBuglist = function(projectId, storyId, callback) {
  console.log("-------------------------------projectId: " + projectId);
  this.update(
    { "projectId" : projectId },
    { $push: { "buglist.stories" : storyId
  }
},
{
  upsert: true
}
)
.exec(function(err , doc) {
  if (err) {
    callback(err, null);
  }
  else {
    callback(null, doc);
  }
});
}

backlogBuglist = mongoose.model('BacklogBuglist', backlogBuglistSchema, "backlogBuglist_collection");
module.exports = backlogBuglist;
