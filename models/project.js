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
  ScrumMaster: [{
    type: Schema.ObjectId,
    ref: 'User'
  }], //TODO : hardcoded to be fixed
  memberList: [{
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }],
  release: [releaseSchema]
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
  this.update({
      "_id": projectId
    }, {
      $pull: {
        "memberList": memberId
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

projectSchema.statics.updateProject = function(projectId, newProject, callback) {
  this.update({
      "_id": projectId
    }, {
      $set: {
        name: newProject.name,
        description: newProject.description,
        date: newProject.date
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

projectSchema.statics.updateRelease = function(projectId, releaseId, newRelease, callback) {
  this.update({
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

// Deletes/pulls the release from the Projects Collection
projectSchema.statics.deleteRelease = function(projectId, releaseId, callback) {
  this.update({
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
  .populate('memberList','_id firstName lastName initials imageUrl' )
    .exec(function(err, doc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, doc);
      }
    });
}
var Project = mongoose.model('Project', projectSchema, "Projects");

module.exports = Project;
