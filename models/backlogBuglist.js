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
