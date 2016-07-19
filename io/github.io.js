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

    io.to("user:"+data.userId).emit("startSync",data.projectId);
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

    var collaboratorOptions={
      url:"https://api.github.com/repos/"+data.owner+"/"+data.name+"/collaborators?access_token="+data.token,
      //qs:{access_token:data.token},
      headers:{
        "User-Agent":'Limber'
      }
    };
    console.log("url---------",collaboratorOptions.url);
    request.post(options,function(err,response,body){
      if(!err){
        console.log("inside of repo socket-------------------");
        var githubRepo= new GithubRepo();
        githubRepo.name=data.name;
        githubRepo.owner=data.owner;
        githubRepo.projectId=data.projectId;
        var memberList=[];
        githubRepo.save(function(err){
          if(!err){
            Project.updateGithubStatus(data.projectId,function(error,statusDoc){
              if(!error){
                console.log("in update");
                //  console.log(doc);
                var githubRepo={
                  'githubStatus':true,
                  'projectId':data.projectId
                };
                memberList=statusDoc.memberList;
                //  console.log(doc);
                // doc.memberList.forEach(function(userID){
                //   var room = "user:"+ userID;
                //   io.to(room).emit('github:changeGithubStatus', githubRepo);
                // });

                //start of collaborators api call
                User.findAll(memberList,function(err,doc)
                {
                  var collaboratorsIds=[];
                  if(!err)
                  {
                    console.log("-------its fine",doc);
                    request.get(collaboratorOptions,function(error,response,body)
                    {
                      if(!error)
                      {
                        var collaborators=JSON.parse(body);
                        var index=0;
                        if(doc.length==0)
                        io.to("user:"+data.userId).emit("stopSync",data.projectId);
                        doc.filter(function(memberGitData)
                        {
                          if(memberGitData.github.name!==undefined)
                          {
                            console.log("collaboratorsIds------------",collaboratorsIds);
                            var flag=0;
                            collaborators.filter(function(member)
                            {
                              if(member.id==memberGitData.github.id)
                              {
                                flag=1;
                              }
                            })
                            if(flag==0)
                            {
                              var putOptions={
                                url:"https://api.github.com/repos/"+data.owner+"/"+data.name+"/collaborators/"+memberGitData.github.name+"?access_token="+data.token,
                                headers:{
                                  "User-Agent":'Limber'
                                }
                              }
                              console.log("before queue-----------",putOptions.url);
                              queue.collaboratorPost.add(putOptions);//push member to queue to make him as collaborator
                            }
                          }
                          else {
                            //notify the user to provide git
                            console.log("this member dosent have git ids",memberGitData.firstName);
                          }
                          index++;
                          if(index==doc.length)
                          {
                            io.to("user:"+data.userId).emit("stopSync",data.projectId);
                            socket.on("SyncIsStopped",function(msg)
                            {
                              statusDoc.memberList.forEach(function(userID){
                                var room = "user:"+ userID;
                                io.to(room).emit('github:changeGithubStatus', githubRepo);
                              });
                            })
                          }

                        })

                        /////////////////////////////////////////////////

                      }
                    });
                  }

                })
              }
            })
            //end of collaborators api call
          }
        });
      }
    })
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
            if(story.issueNumber==null && data.userId.github!==null)
            {
              console.log(story.storyCreatorId.github);
              var assignees=[];
              if(story.memberList){
                story.memberList.forEach(function(member){
                  if (member.github!=undefined){
                    assignees.push(member.github.name)
                  }
else {
//in story shema add that user
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
              issue.github_profile=story.storyCreatorId.github;
              console.log(issue);
              queue.storyPost.add(issue);
            }
            else if(data.userId.github==null)
            {console.log("no github");
            console.log(story._id);

//check if


          }
        })



      })
    }


  })
})

}
