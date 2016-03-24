var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectSchema =new Schema({
  name : String,
  description : String,
  date : Date,
  ScrumMaster : [{type : Schema.ObjectId, ref : 'User'}],//TODO : hardcoded to be fixed
  memberList : [{type : Schema.ObjectId, ref : 'User'}],
  release : [
    {
      name : String,
      description : String,
      creationDate : Date,
      releaseDate : Date,
      sprints : [{type : Schema.ObjectId, ref : 'Sprint'}]
    }
  ]
});

projectSchema.statics.addMember = function(projectId, memberId, callback) {
  console.log("------------------------ in side updateRelease " + projectId);
  console.log("-----------------newRelease.name = " + memberId);
  this.update(
      { "_id" : projectId},
      { $push: {
            "memberList" : {$each: memberId}
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

projectSchema.statics.removeMember = function(projectId, memberId, callback) {
  console.log("------------------------ in side updateRelease " + projectId);
  console.log("-----------------newRelease.name = " + memberId);
  this.update(
      { "_id" : projectId},
      { $pull: {
            "memberList" : memberId
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
projectSchema.statics.updateProject = function(projectId, newProject, callback) {
  console.log("------------------------ in side updateProject " + projectId);
  this.update(
      { "_id" : projectId },
      { $set: {
          name : newProject.name,
          description : newProject.description,
          date : newProject.date
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

projectSchema.statics.updateRelease = function(projectId, releaseId, newRelease, callback) {
  console.log("------------------------ in side updateRelease " + projectId);
  console.log("-----------------newRelease.name = " + newRelease.name);
  this.update(
      { "_id" : projectId, "release._id" : releaseId },
      { $set: {
            "release.$.name" : newRelease.name,
            "release.$.description" : newRelease.description,
            "release.$.creationDate" : newRelease.creationDate,
            "release.$.releaseDate" : newRelease.releaseDate
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

projectSchema.statics.addRelease = function(projectId, release, callback) {
  console.log("-------------------------------projectId: " + projectId);
  this.update(
      { "_id" : projectId },
      { $push: { release : {
            name : release["name"],
            description : release["description"],
            creationDate : release["creationDate"],
            releaseDate : release["releaseDate"]
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

projectSchema.statics.addSprint = function(projectId, releaseId, sprint, callback) {
  console.log("-------------------------------projectId: " + projectId);
  this.update(
      { "_id" : projectId, "release._id" : releaseId },
      { $push: { "release.$.sprints" : sprint._id
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
       console.log("------------------------ Added Sprint in project");
       callback(null, doc);
     }
   });
}
projectSchema.statics.findProj = function(projectList, callback) {
  console.log("???????????????????????????????????????????????????????");
  projectList = projectList.split(',');
  this.find({ '_id' : {$in : projectList} })
  .populate("release.sprints", "name endDate startDate description")
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       callback(null, doc);
     }
   });
}
  var Project = mongoose.model('Project', projectSchema, "Projects");

module.exports = Project;
