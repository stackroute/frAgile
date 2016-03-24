var mongoose = require('mongoose'),
  userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    createdDate: Date,
    updatedDate: Date,
    password: String,
    email: String,
    initials: String,
    imageUrl: String,
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }]
  });

userSchema.statics.addUser = function(userDetails, callback) {
  console.log("---------------------- inside addUser model");

  this.create({
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    createdDate: (userDetails.createdDate) ? (userDetails.createdDate) : Date.now(),
    updatedDate: Date.now(),
    password: userDetails.password,
    email: userDetails.email,
    initials: userDetails.firstName.charAt(0) + userDetails.lastName.charAt(0),
    imageUrl: userDetails.imageUrl ,
    projects: userDetails.projects == undefined ? [] : userDetails.projects
  },
  function(err, data) {
    if (err){
      callback(err);
    }
    else{
      callback(data);
    }
  });
}

userSchema.statics.addProjectToUser = function(userID, projectID, callback) {
  console.log("-----------------------userID " + userID);
  this.update({"_id" : {$in : userID}},
    {$push: {
      'projects': projectID
    },
    $set: {
      'updatedDate' : Date.now()
    }
  }, {multi:true}, function(err, data) {
    if (err) callback(err)
    else {
      console.log("------------------------- Added YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
      callback(data);
    }
  })
}

userSchema.statics.removeProjectfromUser = function(userID, projectID, callback) {
  console.log("[[[[[[[[[[[[[[[[[[[[1]]]]]]]]]]]]]]]]]]]]");
  this.findByIdAndUpdate(userID, {
    $pull: {
      'projects': projectID
    },
    $set: {
      'updatedDate' : Date.now()
    }
  }, {new:true },function(err, data) {
    console.log("----------------------done");
    if (err) callback(err)
    else {
      console.log("------------------ done");
      callback(data);}
  })
}

userSchema.statics.getPassword = function(email, callback) {
  return this.find({'email': email}).exec(function(err, data) {
    if (err) callback(err)
    else callback(data);
  });
}
module.exports = mongoose.model('Users', userSchema, 'Users');;
