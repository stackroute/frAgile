fragileApp.controller('addMemberToChecklistController',['$scope','$rootScope','$stateParams','storyService','modalService','$uibModal','$uibModalInstance','$location','param','Socket',function($scope,$rootScope,$stateParams,storyService,modalService,$uibModal,$uibModalInstance,$location,param,Socket){
      var socket = Socket($scope);


$scope.assignedMember=[];
$scope.currentItemId=param.listItem._id;

  $scope.initLoadMembersOfItem=function(){
    $scope.assignedMember=$scope.assignedMember.concat(param.listItem.assignedMember);
    console.log("yahoooooooo,: ",param.listItem.assignedMember);
  }//end of load member Item

	$scope.initLoadMembersOfStory = function(){
    //$scope.memberDetails= param.projMembers;

    /*** Declaring variables required for addMembers,addLabels***/
    $scope.longDescLimit=25 ;
    $scope.checked = true;
    $scope.membersData=[];
    console.log($scope.currentItemId);
    /** XHR request to fetch latest members details***/
    //console.log($scope.storyDetails._id);
    $scope.storyMember=param.members;

  }//end of init load member

  $scope.addRemoveMembersList=function(memberObj){
       // param.listItem.assignedMember.push(memberObj);
        var result=param.listItem.assignedMember.filter(function(obj)
      {
        return obj._id==memobj._id;
      })
      var operation;
      if(result.length==0)
        operation="add";
      else
        operation="delete";
          socket.emit('story:addRemoveMembersListItem',{"operation":operation,"storyId":param.storyId,"checkListId":param.checkListId,"roomName":param.roomName,"memberObj":memberObj,"listItem":param.listItem});

          console.log("i have reached",param.storyId,param.checkListId);

  }//addRemoveMembersList

    $scope.cancel=function(){
    //Use it for dismisal of modal
    $uibModalInstance.dismiss('cancel');
  }

   //
        socket.on('memberAdded',function(data){
        console.log("event recieved --->",data.memberObj);

        var check=$scope.assignedMember.filter(function(obj)
        {
            return obj._id==data.memberObj._id;
        });

        if(check.length==0)
        {
          $scope.assignedMember.push(data.memberObj);
        }

       });

	}]);//end of main app
