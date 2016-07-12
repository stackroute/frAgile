var User = require('../models/user.js');
var GithubRepo = require('../models/githubRepo.js');
var Project = require('../models/project.js');
var Story = require('../models/story.js');
var request=require('request');
var github_api = require("../routes/github-api.js");
var BackLogsBugList = require('../models/backlogBuglist.js');
var queue= require('../redis/queue.js');

module.exports = function(socket, io) {
  socket.on('github:addRepo', function(data) {
    io.to("user:"+data.userId).emit("syncing event",{syncing:true,projectId:data.projectId});
    var message={
      "name": "web",
      "active": true,
      "events": [
        "issues",
        "issue_comment",
        "member"
      ],
      "config": {
        "url": "http://gamersdemokrasy.com:8000/issueEvents",
        "content_type": "json"
      }
    }

    var options={
      url:"https://api.github.com/repos/"+data.owner+"/"+data.name+"/hooks?access_token="+data.token,
      headers:{
        "content-type":'application/json',
        "User-Agent":'Limber'
      },
      json:message
    };
    request.post(options,function(err,response,body){
      if(response.statusCode===201 && !err){
console.log("webhook response");
console.log(response);
console.log(body);
 }
    })
    var githubRepo= new GithubRepo();
    githubRepo.name=data.name;
    githubRepo.owner=data.owner;
    githubRepo.projectId=data.projectId;
    githubRepo.save(function(err){
      if(!err){
        Project.updateGithubStatus(data.projectId,function(error,doc){
          if(!error){
            console.log("in update");
            console.log(doc);
            var githubRepo={
              'githubStatus':true,
              'projectId':data.projectId
            };

            console.log(doc);
            doc.memberList.forEach(function(userID){
              var room = "user:"+ userID;
              io.to(room).emit('github:changeGithubStatus', githubRepo);
            });


          }

        })
      }
    });

  })
  socket.on("github:convertToStory",function(data){
    console.log("Listening for converting Story",data);
    data.issues.forEach(function(obj){
      var story=new Story();
      story.listId="Backlogs";
      story.heading=obj.title;
      story.projectId=data.projectId;
      story.description=obj.body;
      story.createdTimeStamp=Date.now();
      story.lastUpdated=Date.now();
      story.memberList=obj.assignees;
      story.issueNumber=obj.number;
      GithubRepo.getRepo(data.projectId,function(err,repoDetails){
        story.githubSync=repoDetails._id;
        story.storyCreatorId=data.userProfile._id;


        story.save(function(err,storyData){
          if(!err){
            console.log("Github Issues Added",storyData);
            BackLogsBugList.addStoryBacklog(data.projectId, storyData._id, function(err, subDoc) {
              if(!err){
                console.log("Updated Backlog bUg list",subDoc);
                console.log("BacklogBuglist:"+data.projectId);
                io.to("BacklogBuglist:"+data.projectId).emit("sprint:storyAdded",storyData);
              }

            })
          }
        })
      })

    })


  })

  socket.on("github:pushStories",function(data){
    console.log("in push Stories",data);
    GithubRepo.getRepo(data.projectId,function(err,repoData){
      console.log("Repository Details",repoData);
      if(!err && repoData){
        Story.updateGithubSync(data.projectId,data.userId,repoData._id,function(err,storyData){
          console.log("Stories All Project",storyData);
          storyData.forEach(function(story){
            if(story.issueNumber==null && story.storyCreatorId.github!==null)
            {
              console.log(story.storyCreatorId.github);
              var assignees=[];
              if(story.memberList){
                story.memberList.forEach(function(member){
                  if (member.github!=undefined){
                    assignees.push(member.github.name)
                  }
                })
              }

              var issue={};
              issue.message={
                'title':story.heading,
                'assignees':assignees,
                'labels':[story.listId],
                'body':story.description,
                'storyId':story._id


              }
              issue.repo_details=repoData;
              issue.github_profile=data.githubProfile;
              console.log(issue);
              queue.storyPost.add(issue);
            }
            else if(story.storyCreatorId.github==null)
            {console.log("no github");
            console.log(story._id);




          }
        })



      })
    }


  })
})

}
