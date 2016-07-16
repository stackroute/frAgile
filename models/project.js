var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var releaseSchema = new Schema({
  name: String,
  description: String,
  creationDate: Date,
  releaseDate: Date,
  sprints: [{
    type: Schema.ObjectId,
    ref: 'Sprint'
  }]
});

var projectSchema = new Schema({
  name: String,
  description: String,
  date: Date,
  //labelId:{type:Schema.ObjectId,ref:'Template'},
  ScrumMaster: [{
    type: Schema.ObjectId,
    ref: 'User'
  }], //TODO : hardcoded to be fixed
  memberList: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  collaboratorsList:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  gitStories:[{
    type:Schema.Types.ObjectId,
    ref:'Story'
  }],
  githubStatus: Boolean,
  release: [releaseSchema]
  // repository: {type: Schema.Types.ObjectId,ref: 'GithubRepo'}
});

projectSchema.statics.getSprints = function(releaseID, callback) {
  this.find({
      "release._id": releaseID
    }, {
      "_id": "0",
      'release.$': 1
    })
    .populate("release.sprints")
    .exec(function(err, data) {
      if (err) callback(err)
      else callback(data);
    });
}

projectSchema.statics.addMember = function(projectId, memberId, callback) {
  this.update({
      "_id": projectId
    }, {
      $addToSet: {
        "memberList": {
          $each: memberId
        }
      }
    }, {
      upsert: true
    })
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {

        callback(null, doc);
      }
    });
}

projectSchema.statics.removeMember = function(projectId, memberId, callback) {
  this.findByIdAndUpdate(projectId, {
      $pull: {
        "memberList": memberId
      }
    }, {
      new: true,
      upsert: true
    })
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}

projectSchema.statics.updateProject = function(projectId, newProject, callback) {
  console.log("----------Inside project model");
  console.log("-" + projectId + "-");
  console.log(newProject);
  this.findOneAndUpdate({
      "_id": projectId
    }, {
      $set: {
        name: newProject.name,
        description: newProject.description
      }
    }, {
      upsert: true
    })
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}

projectSchema.statics.updateGithubStatus = function(projectId, callback) {
  console.log("----------Inside update github model");
  console.log("-" + projectId + "-");
  //console.log(newProject);
  this.findOneAndUpdate({
      "_id": projectId
    }, {
      $set: {
        githubStatus: true

      }
    }, {
      upsert: true
    })
    .exec(function(err, doc) {
      console.log("in github"+doc);
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}
projectSchema.statics.updateRelease = function(projectId, releaseId, newRelease, callback) {
  this.findOneAndUpdate({
      "_id": projectId,
      "release._id": releaseId
    }, {
      $set: {
        "release.$.name": newRelease.name,
        "release.$.description": newRelease.description,
        "release.$.creationDate": newRelease.creationDate,
        "release.$.releaseDate": newRelease.releaseDate
      }
    }, {
      upsert: true,
      new:true
    })
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}

// Deletes/pulls the release from the Projects Collection
projectSchema.statics.deleteRelease = function(projectId, releaseId, callback) {
  this.findOneAndUpdate({
      "_id": projectId
    }, {
      $pull: {
        "release": {
          _id: releaseId
        }
      }
    })
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}

// Deletes/pulls the sprintId from the Projects Collection
// TODO - Delete sprint from sprints collection
projectSchema.statics.deleteSprint = function(projectId, releaseId, sprintId, callback) {
  this.update({
      "_id": projectId,
      "release._id": releaseId
    }, {
      $pull: {
        "release.$.sprints": sprintId
      }
    })
    .exec(function(err, doc) {
      if (err)
        callback(err, null);
      else
        callback(null, doc);
    })
}

projectSchema.statics.addRelease = function(projectId, release, callback) {
  this.findByIdAndUpdate(projectId, {
      $push: {
        release: {
          name: release["name"],
          description: release["description"],
          creationDate: release["creationDate"],
          releaseDate: release["releaseDate"]
        }
      }
    }, {
      upsert: true,
      new: true
    })
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}

// Adds sprintId in the sprint array of Projects Collection
projectSchema.statics.addSprint = function(projectId, releaseId, sprint, callback) {
  this.findOneAndUpdate({
      "_id": projectId,
      "release._id": releaseId
    }, {
      $push: {
        "release.$.sprints": sprint._id
      }
    }, {
      upsert: true
    })
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}

projectSchema.statics.findProj = function(projectList, callback) {
  projectList = projectList.split(',');
  this.find({
      '_id': {
        $in: projectList
      }
    })
    .populate("release.sprints", "name endDate startDate description")
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}
projectSchema.statics.getProjectMembers = function(projectId, callback) {

  this.findOne({"_id":projectId})
  .populate('memberList','_id firstName lastName photo' )
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}

/***
author:Sharan
method: getStoryMoveData
parameter:projectId
description: This method will get name and id of all the releases, sprints of each release and list of each sprint required for moving the story within a project.
***/
projectSchema.statics.getStoryMoveData=function(projectId,callback){
  console.log("received inside model----->"+projectId);
  this.findOne({"_id":projectId},{memberList:0,ScrumMaster:0})
  .populate('release.sprints','_id list name' )
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}

projectSchema.statics.updateCollaborators=function(data,callback)
{
  this.findOne(
    {
      "_id":data.projectId
    }).exec(function(err,projectData)
  {
    if(projectData.collaboratorsList.indexOf(data.collaboratorId)==-1)
    {
      projectData.collaboratorsList.push(data.collaboratorId);
    }
    projectData.save(function(err,doc)
  {
    if(!err)
    callback(null,doc);
  })
  })
}

projectSchema.statics.getCollaboratorsList=function(projectId,callback)
{
this.find({
  "_id":projectId
},{
  collaboratorsList:1
}).exec(function(err,projectData)
{
  if(!err)
  callback(null,projectData);
})
}

projectSchema.statics.findOneProject=function(projectId,callback)
{
this.findOne({
  "_id":projectId
}).exec(function(err,data)
{
  if(!err)
  callback(null,data);
})

}


projectSchema.statics.addGitStory=function(data)
{
  this.findOne(
    {
      "_id":data.projectId
    }
  ).exec(function(err,project)
{
  project.gitStories.push(data.storyId);
  project.save();
})
}

var Project = mongoose.model('Project', projectSchema, "Projects");

module.exports = Project;
