var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/***label schema is required so that we can give the
reference for sub document in sprint schema***/
var labelSchema = new Schema({
  text:String,
  colorCode:String
});

var sprintSchema = new Schema({
      name: String,
      endDate: Date,
      startDate: Date,
      description: String,
      labelTemplate: [labelSchema],
      list: [
        {
          group: String,
          listName: String,
          stories: [{type : Schema.Types.ObjectId, ref : 'Story'}],
        }
      ]
});

//TODO:update the functionality of deleteList properly
sprintSchema.statics.deleteList = function(sprintId, listId, callback) {
  this.remove({ "_id" : sprintId , "release._id" : releaseId})
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       callback(null, doc);
     }
   });
}

sprintSchema.statics.updateSprint = function(sprintId, newSprint, callback) {
  console.log("------------------------ in side updateSprint " + sprintId);
  this.update(
      { "_id" : sprintId },
      { $set: {
        name: newSprint.name,
        endDate: newSprint.endDate,
        startDate: newSprint.startDate,
        description: newSprint.description,
        }
      },
      {
         upsert: true
      }
   )
   .exec(function(err , doc) {
     if (err) {
       console.log("><><><><><><><><><><><><>><><><><><><><><><><><> ERR");
       console.log(err);
       callback(err, null);
     }
     else {
       console.log("><><><><><><><><><><><><>><><><><><><><><><><><> DOC");
       callback(null, doc);
     }
   });
}

sprintSchema.statics.findSprint = function(sprintId, callback) {
  this.findOne({"_id" : sprintId})
    .populate("list.stories", "storyStatus heading descriptionStatus checklistGroupCount attachmentsCount commentCount")
    .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       callback(null, doc);
     }
   });
}

sprintSchema.statics.addStory = function(sprintId, listId, storyId, callback) {
  this.update(
      { "_id" : sprintId, "list._id" : listId},
      { $push: { "list.$.stories" : storyId
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

sprintSchema.statics.deleteStory = function(sprintId, listId, storyId, callback) {
  this.update(
      { "_id" : sprintId, "list._id" : listId},
      { $pull: { "list.$.stories" : storyId
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

var release = mongoose.model('Sprint', sprintSchema, "Sprints");
module.exports = release;
