
// define our nerd model
// module.exports allows us to pass this to other files when it is called
// module.exports = connectionsubject.model('', {}, 'frAgile');


var mongoose = require('mongoose'),
 connectionsubject = new mongoose.Schema({
   storyStatus:[{
     xAxs : String,
     yAxs : String,
   }]
 });

connectionsubject.statics.getgraph= function(graphid,callback){
  console.log("I am in model");
  this.findOne({'_id':graphid})
  .exec(function(err,doc){
    if(err){
      callback(err,null);
    }else{
      callback(null,doc);
    }

  });
}
var graph = mongoose.model('graph', connectionsubject, 'graphdata');
module.exports =graph;
