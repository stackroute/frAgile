fragileApp.controller('addMemberToChecklistController',['$scope','$rootScope','$stateParams','storyService','modalService','$uibModal','$uibModalInstance','$location','param','Socket',function($scope,$rootScope,$stateParams,storyService,modalService,$uibModal,$uibModalInstance,$location,param,Socket){
      var socket = Socket($scope);


$scope.assignedMember=[];
$scope.assignedMemberIndex=[];
$scope.currentItemId=param.listItem._id;
$scope.title=param.listItem.text;

	$scope.initLoadMembersOfStory = function(){
    //$scope.memberDetails= param.projMembers;
    $scope.assignedMember=param.listItem.assignedMember;
    $scope.assignedMember.filter(function(member)
    {
    $scope.assignedMemberIndex.push(member._id);
    });
    /*** Declaring variables required for addMembers,addLabels***/
    $scope.longDescLimit=25 ;
    $scope.checked = true;
    $scope.membersData=[];
    console.log($scope.currentItemId);
    /** XHR request to fetch latest members details***/
    //console.log($scope.storyDetails._id);
    $scope.storyMember=param.members;

    socket.on("story:membersModifiedOnItem",function(data)
    {
    if(param.storyId==data.storyId)
    {
      console.log("before remove-->",$scope.storyMember);
      $scope.storyMember=data.memberList;
      console.log("after remove===>",$scope.storyMember);
    }
  });

console.log("story members --->",$scope.storyMember);
  }//end of init load member

  $scope.addRemoveMembersList=function(memberObj){
       // param.listItem.assignedMember.push(memberObj);
       var index=$scope.assignedMemberIndex.indexOf(memberObj._id);
       if(index!=-1)
       {console.log("im inside");
         $scope.assignedMember.splice(index,1);
         $scope.assignedMemberIndex.splice(index,1);
         console.log("array",$scope.assignedMember,"indexArray",$scope.assignedMemberIndex);
       }
       else {
         $scope.assignedMember.push(memberObj);
         $scope.assignedMemberIndex.push(memberObj._id);
       }
       console.log("assigned member array after 1 added/removed",$scope.assignedMember);
        socket.emit('story:addRemoveMembersListItem',{"indexArray":$scope.assignedMemberIndex,"assignedMember":$scope.assignedMember,"storyId":param.storyId,"checkListId":param.checkListId,"roomName":param.roomName,"memberObj":memberObj,"listItem":param.listItem});
  }//addRemoveMembersList

    $scope.cancel=function(){
    //Use it for dismisal of modal
    $uibModalInstance.dismiss('cancel');
  }

   //
        socket.on('memberAdded',function(data){
        console.log("event recieved --->",data.memberObj);
        if($scope.currentItemId==data.listItem._id)
        {
          $scope.assignedMember=data.assignedMember;
          $scope.assignedMemberIndex=data.indexArray;
        }
       });

	}]);//end of main app
