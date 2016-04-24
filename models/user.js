var Project = require('../models/project.js');

var mongoose = require('mongoose'),
  userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    createdDate: Date,
    updatedDate: Date,
    password: String,
    email: String,
    initials: String,
    photo: String,
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }],
    facebook: {
      id: String,
      token: String,
      email: String,
      name: String
    },
    google: {
      id: String,
      token: String,
      email: String,
      name: String
    }
  });

userSchema.statics.addUser = function(userDetails, callback) {
  this.create({
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    createdDate: (userDetails.createdDate) ? (userDetails.createdDate) : Date.now(),
    updatedDate: Date.now(),
    password: userDetails.password,
    email: userDetails.email,
    initials: userDetails.firstName.charAt(0) + userDetails.lastName.charAt(0),
    imageUrl: userDetails.imageUrl,
    projects: userDetails.projects == undefined ? [] : userDetails.projects
  }, function(err, data) {
    if (err) callback(err)
    else callback(data);
  });
}
userSchema.statics.updateUser = function(userId, newUserDetails, callback) {
  console.log("----------Inside updateUser model");
  console.log("-" + userId + "-");
  console.log(newUserDetails);
  this.findOneAndUpdate({
      "_id": userId
    }, {
      $set: {
        firstName: newUserDetails.firstName,
        lastName: newUserDetails.lastName,
        email: newUserDetails.email
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
userSchema.statics.addProjectToUser = function(userID, projectID, callback) {
  this.findByIdAndUpdate(userID, {
    $addToSet: {
      'projects': projectID
    },
    $set: {
      'updatedDate': Date.now()
    }
  }, {
    new: true
  }, function(err, data) {
    if (err) callback(err, null)
    else {
      //To send back added project data
      Project.find({
        "_id": projectID
      }).populate("release").exec(function(err, data) {
        if (err)
          callback(err, null);
        else {
          callback(null, data);
        }
      })
    };
  })
}

userSchema.statics.removeProjectfromUser = function(userID, projectID, callback) {
  this.findByIdAndUpdate(userID, {
    $pull: {
      'projects': projectID
    },
    $set: {
      'updatedDate': Date.now()
    }
  }, {
    new: true
  }, function(err, data) {
    if (err) callback(err)
    else callback(data);
  })
}

userSchema.statics.getPassword = function(email, callback) {
  return this.find({
    'email': email
  }).exec(function(err, data) {
    if (err) callback(err)
    else callback(data);
  });
}

userSchema.statics.getUserId = function(email, callback) {
  return this.find({
    'email': email
  }).exec(function(err, data) {
    if (err) callback(err, null);
    else callback(null, data);
  });
}

userSchema.statics.getUserEmail = function(email, callback) {
  return this.find({
    'email': RegExp(email)
  }).exec(function(err, data) {
    if (err) callback(err, null);
    else callback(null, data);
  });
}

userSchema.statics.getProjects = function(userID, callback) {
  this.findById(userID).populate("projects").populate("release.0.sprints").exec(function(err, data) {
    if (err) callback(err)
    else callback(data);
  });
}
module.exports = mongoose.model('User', userSchema, 'Users');;
