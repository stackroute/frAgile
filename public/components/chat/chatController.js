fragileApp.controller('chatController',["$scope",'$rootScope', '$mdSidenav','$q', '$timeout','$mdDialog', '$mdMedia','Socket','projectService','$anchorScroll', '$location', function($scope,$rootScope, $mdSidenav,$q, $timeout,$mdDialog, $mdMedia,Socket,projectService,$anchorScroll, $location) {
  var socket = Socket($scope);

  $scope.room=null;
  $scope.id='';
  $scope.projects=$rootScope.projects;

  $scope.openLeftMenu = function(prj) {
    if($scope.project!==undefined && $scope.project!==prj){
      $scope.project=prj;
    }
    else
    {    $scope.project=prj;
      $mdSidenav('left').toggle(); }
      projectService.getMembers(prj._id).success(function(response) {
        console.log(response);
        response.memberList.forEach(function(data) {
          console.log(data);
          if(data.status==="active")
          data.chatStatus='active'
          else data.chatStatus='inactive'

          data.fullName = data.firstName + " " + data.lastName;
        })
        $scope.projMemberList = response.memberList;
      });
    };
    $scope.messages=[];
    var indices=[];

    $scope.channels=[{"prId":"","id":"","name":"general"},{"prId":"","id":"","name":"random"}];
    $scope.click = function() {
      $scope.boolChangeClass = !$scope.boolChangeClass;
      $scope.$apply();
    }
    if($scope.project!==undefined)
    angular.element( document.querySelector( "#"+$scope.project._id ) ).addClass('selectedPrj');

    function DialogController($scope, $mdDialog,data) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
      $scope.project=data;
    }

    function DialogController2($scope, $mdDialog,data) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
      $scope.project=data;
    }




    $scope.createGroup = function(ev,project) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'dialog1.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals:{data:project}
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });



      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });

    };

    //new member

    $scope.inviteUser = function(ev,project) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      $mdDialog.show({
        controller: DialogController2,
        templateUrl: 'dialog2.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals:{data:project}
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });



      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });

    };

    //new member dialog ends here
    //chat functionality starts from here

    socket.on('status',function(data){
      console.log("listening status event");
      if(  $scope.projMemberList!==undefined)
      {
        $scope.projMemberList.forEach(function(member){
          if(member._id==data.user){
            member.chatStatus=data.status;
          }
        }) }
      })





      var userId='user1';

      $scope.chatRoom=function(group){
        $scope.room=group;
      }
      var roomData={};

      $scope.topic="";

      //selecting member
      $scope.chat=function(member,projectId){
        $scope.room=member;
        var emitData={
          'message':  {'command':'generateUUID'},
          'details':{'member':member._id,'projectId':projectId,'userId':$rootScope.currentUserID}
        }
        var memberList=[member._id,$rootScope.currentUserID]
        projectService.getUuid(projectId,memberList).success(function(response){
          console.log("Response from project Service",response);
          if(response.object!==undefined){
            console.log(response);
            $scope.topic=response.object;
            var historyData={
              'message':{'command':'retrieveHistory','content':$scope.topic}
            }

            socket.emit('history',historyData);
          }
          else
          {console.log("no data");
          console.log(response);
          socket.emit('subscribe',emitData);}
        })

      }

      $scope.myMessages=[];


      //sending message
      $scope.send=function(){
      if($scope.message)  $scope.message=$scope.message.replace(/\n/g, "<br />");
        var user={
          'fullName':$rootScope.user.fullName,
          'userId':$rootScope.user._id
        }
        console.log($scope.topic);
        var message={
          'message':{'text':$scope.message,"sentBy":user,"content":$scope.topic,'command':'sendMessage'}, //topic to be saved

        }
        $scope.message="";
        socket.emit('chatMsg',message);
      }


      socket.on('room:chatMessages',function(data){
        console.log(data);
        if(data.command==='retrieveHistory') {
          if($scope.messages.length!=0){
            $scope.messages.forEach(function(messageItem){
              if(messageItem.topicId===data.content){
                messageItem.message=data.text[data.content];
                console.log("mesageItem",messageItem);

              }
            })
          }
          else{
            $scope.messages.push({'topicId':data.content,'message':data.text[data.content]})

          }

        }
        else if(data.command==='sendMessage') {
          var flag=false;
          var item={};
          if($scope.messages.length!=0){

            $scope.messages.forEach(function(messageItem){
              if(messageItem.topicId===data.content){
                messageItem.message.push({'sentBy':data.sentBy,'message':data.text})
                console.log("mesageItem",messageItem);
                flag=true;
              }
            })
            if(!flag){
              $scope.messages.push({'topicId':data.content,'message':[{'sentBy':data.sentBy,'message':data.text}]})
            }
          }
          else{
            $scope.messages.push({'topicId':data.content,'message':[{'sentBy':data.sentBy,'message':data.text}]})
            console.log($scope.messages);
          }

          console.log($scope.messages);

//showing notification for new messages
if(data.sentBy.userId!==$rootScope.currentUserID)
{
if($scope.room._id!==data.sentBy._id)
$scope.new=true;
}
        }


      })


      //join all the channelIds throughout the user
      $rootScope.projects.forEach(function(project){
        projectService.getChannels(project._id).success(function(response){
          console.log(response);
          response.forEach(function(channel){
            console.log("joining all channels");
            socket.emit('sub',channel.object);
          })
        })
      })




    }])
    .config(function($mdIconProvider) {
      $mdIconProvider
      .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
      .defaultIconSet('img/icons/sets/core-icons.svg', 24);
    })
    .directive('scrollBottom', function () {
      return {
        scope: {
          scrollBottom: "="
        },
        link: function (scope, element) {
          scope.$watchCollection('scrollBottom', function (newValue) {
            if (newValue)
            {
              $(element).scrollTop($(element)[0].scrollHeight);
            }
          });
        }
      }
    })
