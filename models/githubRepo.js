var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var githubRepoSchema = new Schema({
  projectId: {type: Schema.Types.ObjectId,ref: 'Project'},
  name: String,
  owner: String,
  issues: [{type: Schema.Types.ObjectId,ref: 'GithubIssues'}]
});

githubRepoSchema.statics.addRepo = function(repoDetails,callback) {
  this.create({
    projectId: repoDetails.projectId,
    name: repoDetails.name,
    owner: repoDetails.owner

},function(err,data){
  if(err)
  callback(err)
  else callback(data);
})}
githubRepoSchema.statics.getRepo = function(prId,callback) {
  return this.findOne({
    'projectId': prId
  }).exec(function(err, data) {
    if (err) callback(err, null);
    else callback(null, data);
  });


}

var GithubRepo = mongoose.model('GithubRepo', githubRepoSchema, "GithubRepos");

module.exports = GithubRepo;
