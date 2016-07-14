var Activity = require('../models/activity.js');
var User = require('../models/user.js');
var Project = require('../models/project.js');
var Sprint = require('../models/sprint.js');
var Story = require('../models/story.js');
var BackLogsBugList = require('../models/backlogBuglist.js');
var Template = require('../models/template.js');
var queue= require('../redis/queue.js');
var GithubRepo = require('../models/githubRepo.js');
var request=require('request');

module.exports={


//----------make a person as collaborator to a project in which he involved-----------
  addCollaborator:function(data)
{
userId=data.userId;
User.getUserMember(userId,function(err,userData)
{
  if(!err)
    {
      userData.projects.filter(function(projectId)
      {
        data.projectId=projectId;
        Project.getCollaboratorsList(projectId,function(err,projectData)
        {
          if(!err && projectData!==undefined)
          {
            //console.log("--------collaborat---------",projectData);
            if(projectData.collaboratorsList!==undefined)
          if(projectData.collaboratorsList.indexOf(userId)==-1)
          {
            GithubRepo.getRepo(projectId,function(err,githubRepo)
            {
                if(!err)
                    {
                        var putOptions={
                          url:"https://api.github.com/repos/"+githubRepo.owner+"/"+githubRepo.name+"/collaborators/"+userData.github.name+"?access_token="+githubRepo.admin.token,
                          headers:{
                            "User-Agent":'Limber'
                                  }
                                      }

                        var dataObject={};
                        dataObject.putOptions=putOptions;
                        dataObject.projectId=projectId;
                        dataObject.userId=userId;
                      request.put(putOptions,function(error,response,body)
                      {
                        if(!error && response.statusCode==="201")
                        {
                          this.pushStories(data);
                        }//if will end here
                      })
                    }
            })
          }
          }
        })
      })
    }
})
},
//----------end of make a person as collaborator to a project in which he involved-----------




//---------making a person as an assignee to a story.
editStory:function(data)
{
console.log("-------------------------------------------received here-------------------------------------------------------------");
  Story.findIssue(data.storyid,function(err,storyData){
    console.log("story--------------------------",storyData);

    if(!err){
      var assignees=[];
      var issue={};
    GithubRepo.getRepo(storyData.projectId,function(err,repoData){
      if(!err && repoData){
        console.log("Repo data---------------",repoData);
        if(storyData.issueNumber){
          User.getUserMember(data.memberid,function(error,memberData){
            console.log("Member Data--------------",memberData);
            console.log("");
            if(!error){
              storyData.memberList.forEach(function(member){

                if(member.github.name!==undefined){
                  console.log("inside member git------------------>");
                  console.log("------meber----------------",member);
                  assignees.push(member.github.name)
                }
                else{
                  storyData.pendingMemberToGithub.push(member._id);
                  storyData.save(function(err,res){
                  //send message here if one person doesn't provide git details but he is added to a project.
                })
                  console.log("Not having github profile",member);
                }
              })
              if(data.atTheTimeOfIntegration==false && memberData.github.name!==undefined)
              {
              assignees.push(memberData.github.name);
            }
            else {
              //send message here if one person doesn't provide git details but he is added to a project.
            }
            if(assignees){
              console.log("assignees-----------",assignees);
            issue.message={
              'assignees':assignees
            }
            issue.repo_details=repoData;
            issue.github_profile=data.github_profile;
            issue.issueNumber=storyData.issueNumber;
            console.log("issue--------------------------------repo_details...",issue.repo_details);
            queue.editStory.add(issue);
          }
          }
          })
    }
  }
})
  }
  })

},
//---------end of making a person as an assignee to a story.




//-------------pushing stories to the github ----------------------
pushStories:function(data)
{
  GithubRepo.getRepo(data.projectId,function(err,repoData){
    console.log("Repository Details",repoData);
    if(!err && repoData){
      Story.updateGithubSync(data.projectId,data.userId,repoData._id,function(err,storyData){
        console.log("Stories All Project",storyData);
        storyData.forEach(function(story){
          if(data.atTheTimeOfIntegration){
            if(story.storyCreatorId===data.userId && story.issueNumber==null){
              pushToGithub(story);
            }
            else if(story.issueNumber!=null){
              editStory({'storyid':story._id,'memberid':data.userId,'atTheTimeOfIntegration':data.atTheTimeOfIntegration})
            }
          }
          else{
            pushToGithub(story)
          }


      })
    })
  }
})
},
//-------------end of pushing stories to the github ----------------------

pushToGithub:function(story){
  if(story.issueNumber==null && story.storyCreatorId.github!==null)
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
        story.pendingMemberToGithub.push(member._id);
        story.save(function(err,res){
          console.log("After Saving",res);
        })
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
},
//------------making all the persons of a project as collaborators if they have provided github details.-----------------
makeCollaborators:function(data)
{
  var collaboratorOptions={
    url:"https://api.github.com/repos/"+data.owner+"/"+data.name+"/collaborators?access_token="+data.githubProfile.token,
    //qs:{access_token:data.token},
    headers:{
      "User-Agent":'Limber'
    }
  };

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
          collaboratorsArray=[];
          doc.filter(function(memberGitData)
          {
            updateData={projectId:'',collaboratorId:''};
            if(memberGitData.github.name!==undefined)
            {
              updateData.projectId=data.projectId;
              updateData.collaboratorId=memberGitData._id;
              Project.updateCollaborators(updateData,function(err,data)
            {
              if(!err)
              console.log("collaborator --->",data.collaboratorsList);
            })
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
                  url:"https://api.github.com/repos/"+data.owner+"/"+data.name+"/collaborators/"+memberGitData.github.name+"?access_token="+data.githubProfile.token,
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
              // socket.on("SyncIsStopped",function(msg)
              // {
              //   statusDoc.memberList.forEach(function(userId){
              //     var room = "user:"+ userId;
              //     io.to(room).emit('github:changeGithubStatus', githubRepo);
              //   });
              // })
            }

          })

          /////////////////////////////////////////////////

        }
      });
    }

  })
}
//------------end of making all the persons of a project as collaborators if they have provided github details.-----------------

}
