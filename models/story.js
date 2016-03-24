/***
Copyrights: StackRoute and Wipro Digital

Author:Sharan, Shrinivas and Soumitra
Date: 21-March-2016

Mongoose is used to define the schema and static operatoins are
written so that it can be reffered from anywhere of the application.
This model describes the schema for the story on
which below set opertaions will be performed.
Most of the fuctions will be moved to intermediate DB(Redis) and
new set of functions need to be brought in to picturewhich will
be used to sync Redis data with MONGO data.

TODO: Need to update few functions w.r.t the intermediate
database which is planned to be implemented.

1. Post to this implementation,we need to update functions
related to attachments(place where we will be storing the files physically)
2. During the implementation of first point please make sure that
we are creating seperate folders for each project and subfolders for each story.
Through this we will not end up in missing\overriding any attachment.
3. Once intermediate DB come into picture, please analyze functions again
and see where are set operation is applicable.
4.Code need to be done w.r.t to the indicators getting updated based
on each operation.This will applied post implementation of intermediate DB.
5. Bring the Concept of Story number for each story whichwill be
further useful like tagging the story with an # and much more.


Note: There is a slight change in the schema, all the indicators
required to be showcased in list for each story as been merged together under
"indicator section". Recheck if any changes need to be applide
where ever populate is done.
***/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StorySchema = new Schema({
 listId:String,
 storyCreatorId: {type:Schema.Types.ObjectId,ref:'User'},
 storyStatus:String,
 heading: String,
 description: String,
 createdTimeStamp: Date,
 lastUpdated: Date,
 indicators:{
           descriptionStatus: Boolean,
           checklistGroupCount: Number,
           attachmentsCount: Number,
           commentCount: Number
},
 attachmentList: [{
   fileName: String,
   timeStamp: Date,
   attachmentType:String,
   addedByUserName:String,
   addedByUserId:{type:Schema.Types.ObjectId,ref:'User'},
   path : String
 }],
 checklist: [
   {
     checklistHeading:String,
     checkedCount: Number,
     items: [{
       text: String,
       checked: Boolean,
       createdBy:{type:Schema.Types.ObjectId,ref:'User'},
       creationDate:Date,
       creatorName:String
     }]
   }
 ],
 memberList: [{type:Schema.Types.ObjectId,ref:'User'}],
 labelList:[{type:Schema.Types.ObjectId,ref:'Sprint.labelSchema'}]
});

//Code merge by sharan Starts:

/*** addMembers function is used to assign the members to
the story from the project members list.**/
Story.statics.addMembers = function(storyId,membersId, callback) {
  console.log("im inside model addMembers");
//Find was written only for reference
//  this.findOne({"_id":storyId}).exec(function(err,doc){ console.log(doc);});
  this.update(
      { "_id" : storyId },
      { $push: { memberList : membersId
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

/*** removeMembers function is used to remove the members from
the story.**/
Story.statics.removeMembers = function(storyId,membersId, callback) {
  this.update(
      { "_id" : storyId },
      {$pull: {memberList:{$in:[membersId] }}
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

/*** removeAttachment function is used to remove the the attachment
(documents\images\etc) details from the story.
TODO: Need to update the below code w.r.t deletion of files from memory
where atachments are stored**/
Story.statics.removeAttachment = function(storyId,attachmentId, callback) {
  this.update(
      { "_id" : storyId },
      {$pull: {attachmentList:{$in:[attachmentId] }}
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

/*** addAttachments function is used to add the the attachment
(documents\images\etc) to the story.
TODO: Need to implement where the attachments will be stored
in the disk**/
Story.statics.addAttachments = function(storyId,atachmentObj, callback) {
  this.findOne({"_id":storyId}).exec(function(err,doc){ console.log(doc);}); //TODO: Update indicators count
  this.update(
      { "_id" : storyId },
      { $push: {attachmentList:{
        fileName: atachmentObj['fileName'],
        timeStamp: atachmentObj['timeStamp'],
        attachmentType:atachmentObj['attachmentType'],
        addedByUserName:atachmentObj['addedByUserName'],
        addedByUserId:atachmentObj['addedByUserId'],
        path : atachmentObj['path']}
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

/***
updateChecklistItems function is to add or delete or update particular
checklist item in each group.
***/
Story.statics.updateChecklistItems = function(storyId,checklistObj, callback) {
//TODO: write function to delete particular item or check particular item
}

/***
addChecklistGroup function is to add new checklist group to the story.
***/

Story.statics.addChecklistGroup = function(storyId,checklistObj, callback) {

  this.update(
      { "_id" : storyId },
      { $push: {checklist:{
        checklistHeading:checklistObj['checklistHeading'],
        checkedCount: checklistObj['checkedCount'],
        items: checklistObj['items']
      }
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

/***
addChecklistGroup function is to remove checklist group to the story.
***/
Story.statics.removeChecklistGroup = function(storyId,checklistgroupId, callback) {
  //TODO: write function to delete particular item or check particular item
  this.update(
      { "_id" : storyId },
      {$pull: {checklist:{$in:[checklistgroupId] }}
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


/***
updateLabelList function is used to Add and Delete a label reference in a story.
***/
Story.statics.updateLabelList = function(storyId,labelListId,operation, callback) {
switch (operation) {
  case "add": this.update(
      { "_id" : storyId },
      { $push: {labelList:labelListId
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
    break;
  case "delete": this.update(
      { "_id" : storyId },
      {$pull: {labelList:{$in:[labelListId] }}
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
    break;
}
}

//Sharan changes Ends
/***
updateLabelList function is used to Delete from the stories collection.
Need to relook into this based on future implementation.
***/

StorySchema.statics.deleteStory = function(storyId, callback) {
  console.log("-------------------------------deleting Story: " + storyId);
  this.remove({ "_id" : storyId })
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       console.log("-------------------------Deleted Story");
       callback(null, doc);
     }
   });
}

var Story = mongoose.model('Story', StorySchema);
module.exports=Story;
