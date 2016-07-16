var Queue = require('bull');
var request= require('request');
var storyPost=Queue("Server1",6379,'127.0.0.1');
var editStory=Queue("Server2",6379,'127.0.0.1');
var commentPost=Queue("Server3",6379,'127.0.0.1');
var Story=require("../models/story.js");
var BackLogsBugList=require("../models/backlogBuglist.js");
var GithubRepo=require("../models/githubRepo.js");
var collaboratorPost=Queue("Server4",6379,'127.0.0.1');
var addGitIssues=Queue("Server5",6379,'127.0.0.1');
var io=require("../io/io.js");
var User=require("../models/user.js");
var Sprint=require("../models/sprint.js");
var databaseCall =require("../githubIntegration/databaseCall.js");
var Project=require("../models/project.js");
storyPost.process(function(job,done){
 var options={
   url:"https://api.github.com/repos/"+job.data.repo_details.owner+"/"+job.data.repo_details.name+"/issues?access_token="+job.data.github_profile.token,
   headers:{
     "content-type":'application/json',
     "User-Agent":'Limber'
   },
   json:job.data.message
 };
 console.log(options.url);
 console.log(job.data);
 request.post(options,function(err,res,body){
   //console.log(res);
   if(!err && res.statusCode==201){
  console.log(body);
     Story.findOne({_id: job.data.message.storyId}, function (err, story) {
         story.issueNumber = body.number;
         story.save(function (err) {
             if(err) {
                 console.error('ERROR!');
             }
             done(null,body);

         });
     });
     //done(Error('some error'));
   }
   done(body,null);
 })

});

commentPost.process(function(job,done){
  var options={
    url:"https://api.github.com/repos/"+job.data.repo_details.owner+"/"+job.data.repo_details.name+"/issues/"+job.data.issueNumber+"/comments?access_token="+job.data.github_profile.token,
    headers:{
      "content-type":'application/json',
      "User-Agent":'Limber'
    },
    json:job.data.message,

  };
 request.post(options,function(err,res,body){
if(!err && res.statusCode==="201") done(null,body);
done(res,null);

})


})
//
editStory.process(function(job,done){
  var options={
    url:"https://api.github.com/repos/"+job.data.repo_details.owner+"/"+job.data.repo_details.name+"/issues/"+job.data.issueNumber+"?access_token="+job.data.github_profile.token,
    headers:{
      "content-type":'application/json',
      "User-Agent":'Limber'
    },
    json:job.data.message,
    method: "PATCH"
  };

  console.log(options.url);
  console.log(job.data);
  request.post(options,function(err,res,body){
    console.log("error----------------",err);
    //console.log(res);
    //console.log(body);
    //console.log(res.statusCode);
    done(body,null)


});
});


//adding collaborator to git starts here
collaboratorPost.process(function(job,done)
{
 console.log("---------------jod data=----",JSON.stringify(job.data));
 request.put(job.data.urlOptions,function(error,response,body)
{
 if(!error && job.data.addingOneMember==false)
 {
   Project.updateCollaborators({projectId:job.data.projectId,collaboratorId:job.data.userId},function(err,projectData)
   {
     console.log("adding as collaborator---------------------- ----------------------------------",projectData.collaboratorsList);
     if(!err)
       {
       console.log("in queue--- calling pushStories function ---------");
       githubCall.pushStories({atTheTimeOfIntegration:job.data.atTheTimeOfIntegration,projectId:job.data.projectId,userId:job.data.userId,collaboratorsList:projectData.collaboratorsList});
       done(body,null)
       }
   });
}
else {
 done(body,null)
}
});
});
//adding collaborator to git ends here

addGitIssues.process(function(job,done){
  console.log("inside addGitIssues");
  var owner=job.data.repository.owner.login;
  var name=job.data.repository.name;
  var number=job.data.issue.number;

  console.log(job.data);
  if(job.data.action==="opened"){
    console.log("in opened",owner,name);
  GithubRepo.getGitRepo(owner,name,function(err,doc){
    console.log(doc);
    if(!err && doc){
      console.log(doc);

      Story.findbyGithubId(doc._id,number,function(error,storyData){
        console.log(storyData);
        if(!error && !storyData){
          var story=new Story();
          User.findOne({'github.id': job.data.sender.id}, function(err, user){
            if(user){
              story.storyCreatorId=user._id
            }
            else{
              story.issueCreatorId=job.data.sender.id;
            }

          story.listId="Backlogs";
          story.heading=job.data.issue.title;
          story.projectId=doc.projectId;
          story.description=job.data.issue.body;
          story.createdTimeStamp=Date.now();
          story.lastUpdated=Date.now();
          story.memberList=job.data.issue.assignees;
          story.issueNumber=job.data.issue.number;
          story.githubSync=doc._id;

          story.save(function(err,story){
            if(!err){
              console.log("Github Issues Added",story);
              BackLogsBugList.addStoryBacklog(doc.projectId, story._id, function(err, subDoc) {
                if(!err){
                  console.log("Updated Backlog bUg list",subDoc);
                  console.log("BacklogBuglist:"+doc.projectId);
                  io.to("BacklogBuglist:"+doc.projectId).emit("sprint:storyAdded",story);
                  done(null,null);
                }

              })
            }
          })
        })
        }
        else done()
      })
    }
    else done()

  })


  }
  else if(job.data.action==="assigned" || job.data.action==="unassigned"){
    console.log("in Assigned");
    GithubRepo.getGitRepo(owner,name,function(err,doc){
      if(!err && doc){
        console.log(doc);

        Story.findbyGithubId(doc._id,number,function(error,storyData){
          if(!error && storyData){
            console.log("Story ",storyData);
            User.findOne({'github.id': job.data.assignee.id}, function(err, user){
              console.log(user);
              if(!err && user){
                if(job.data.action==="assigned"){
                if(storyData.memberList.indexOf(user._id)==-1){
                  Sprint.findSprintForStory(storyData._id,function(err,sprint){
                    if(!err){
                      console.log("Sprints",sprint);
                      user.fullName=user.firstName + " " + user.lastName
                      var data={
                        'storyid':storyData._id,
                        'memberid':user._id,
                        'user':user,
                        'room':"sprint:"+sprint._id,
                        'projectID':storyData.projectId,
                        'fullName': user.firstName + " " + user.lastName

                      };
                      console.log("Data in ",data);
                      databaseCall.addMember(data);
                      //storyData.memberList.push(user._id);
                    }
                  })

                }
                }
                else if(job.data.action==="unassigned"){
                  var index=storyData.memberList.indexOf(user._id);
                  if(index!=-1){
                    Sprint.findSprintForStory(storyData._id,function(err,sprint){
                      if(!err){
                        console.log("Sprints",sprint);
                        user.fullName=user.firstName + " " + user.lastName
                        var data={
                          'storyid':storyData._id,
                          'memberid':user._id,
                          'user':user,
                          'room':"sprint:"+sprint._id,
                          'projectID':storyData.projectId,
                          'fullName': user.firstName + " " + user.lastName

                        };
                        console.log("Data in ",data);
                        databaseCall.removeMember(data);
                        //storyData.memberList.push(user._id);
                      }
                    })
                    //storyData.memberList.splice(index,1);

                  }
                  // storyData.save(function(err,res){
                  //   console.log(res);
                  //   done()
                  // })
                }


                }

              else{
                //code for not assignees not having github id in DB
                storyData.pendingMemberFromGithub.push(job.data.assignee.id);
                storyData.save(function(err,res){
                  done();
                })
              }
            })
          }
          done()
        })
      }
      done()
    })
  }
  else if(job.data.action==="closed"){
    GithubRepo.getGitRepo(owner,name,function(err,doc){
      if(!err && doc){
        console.log(doc);

        Story.findbyGithubId(doc._id,number,function(error,storyData){
          if(!error && storyData){
            console.log("Story ",storyData);
            User.findOne({'github.id': job.data.sender.id}, function(err, user){
              console.log(user);
              if(user){
              user.fullName=user.firstName + " " + user.lastName;
            }
              else {
                user={};
                user.fullName=job.data.sender.login;
              }
              if(!err){
                 if(storyData.listId==="inProgress"){
                Sprint.findSprintForStory(storyData._id,function(err,sprint){
                  console.log("sprint",sprint);
                  if(!err && sprint){
                    var group="Releasable";
                    Sprint.findReleasableListId(sprint._id,group,function(error,releasableListId){
                      console.log(releasableListId);
                      if(!error){
                        var data={
                        'room': "sprint:"+sprint._id,
                        'activityRoom': 'activity:' + storyData.projectId,
                        'projectID': storyData.projectId,
                        'sprintId': sprint._id,
                        'oldListId': sprint.list[0]._id,
                        'newListId': releasableListId.list[0]._id,
                        'newListName':"Releasable",
                        'storyId': storyData._id,
                        'user':user
                      }
                      databaseCall.moveStory(data)
                        //'github_profile':$rootScope.githubProfile


          }


        })
        }
      })
    }
        else if(storyData.listId==="Backlogs"){
          Project.getRelease(storyData.projectId,function(err,release){
            console.log("Release",release[0].release.sprints);
            if(!err && release){
            Sprint.findCurrentSprint(release[0].release.sprints,function(error,sprint){
              console.log("current Sprint",sprint[0]);
              if(!error && sprint){
                var group="Releasable";
                Sprint.findReleasableListId(sprint[0]._id,group,function(error,releasableListId){

                    console.log(releasableListId);
                    if(!error){
                      var data={
                      'room': "sprint:"+sprint[0]._id,
                      'activityRoom': 'activity:' + storyData.projectId,
                      'projectID': storyData.projectId,
                      'sprintId': sprint[0]._id,
                      'oldListId': "backlogs",
                      'newListId': releasableListId.list[0]._id,
                      'newListName':"Releasable",
                      'storyId': storyData._id,
                      'user':user
                    }
                    console.log("data",data);
                    databaseCall.moveFromBackbug(data)
                      //'github_profile':$rootScope.githubProfile


        }


                })
              }

            })
          }
          })
        }
        else if(storyData.listId==="BugLists"){
          Project.getRelease(storyData.projectId,function(err,release){
            console.log("Release",release);
            if(!err && release){
            Sprint.findCurrentSprint(release[0].release.sprints,function(error,sprint){
              console.log("current Sprint",sprint[0]);
              if(!error && sprint[0]){
                var group="Releasable";
                Sprint.findReleasableListId(sprint[0]._id,group,function(error,releasableListId){

                    console.log(releasableListId);
                    if(!error){
                      var data={
                      'room': "sprint:"+sprint[0]._id,
                      'activityRoom': 'activity:' + storyData.projectId,
                      'projectID': storyData.projectId,
                      'sprintId': sprint[0]._id,
                      'oldListId': "buglists",
                      'newListId': releasableListId.list[0]._id,
                      'newListName':"Releasable",
                      'storyId': storyData._id,
                      'user':user
                    }
                    databaseCall.moveFromBackbug(data)
                      //'github_profile':$rootScope.githubProfile


        }


                })
              }

            })
          }
          })
        }

        }
      })
    }
  })

        }
        })
      }

      else if(job.data.action==="reopened"){
        GithubRepo.getGitRepo(owner,name,function(err,doc){
          if(!err && doc){
            console.log(doc);

            Story.findbyGithubId(doc._id,number,function(error,storyData){
              if(!error && storyData){
                console.log("Story ",storyData);
                User.findOne({'github.id': job.data.sender.id}, function(err, user){
                  console.log(user);
                  if(user){
                  user.fullName=user.firstName + " " + user.lastName;
                }
                  else {
                    user={};
                    user.fullName=job.data.sender.login;
                  }
                  if(!err){
                    if(storyData.listId==="Releasable"){
                      Sprint.findSprintForStory(storyData._id,function(err,sprint){
                        console.log("sprint",sprint);
                        if(!err && sprint){
                          var group="Releasable";
                          Sprint.findReleasableListId(sprint._id,group,function(error,releasableListId){
                            console.log(releasableListId);
                            if(!error){
                              var data={
                              'room': "sprint:"+sprint._id,
                              'activityRoom': 'activity:' + storyData.projectId,
                              'projectID': storyData.projectId,
                              'sprintId': sprint._id,
                              'oldListId': releasableListId.list[0]._id,
                              'newListId': "backlogs",
                              'newListName':"Backlogs",
                              'storyId': storyData._id,
                              'user':user
                            }
                            databaseCall.moveToBackBug(data)
                              //'github_profile':$rootScope.githubProfile


                }


              })
              }
            })
                    }
                  }
                })
              }
            })
          }
        })

      }

//  done()

done()
})

module.exports.storyPost=storyPost;
module.exports.collaboratorPost=collaboratorPost;
module.exports.editStory=editStory;
module.exports.commentPost=commentPost;
module.exports.addGitIssues=addGitIssues;
