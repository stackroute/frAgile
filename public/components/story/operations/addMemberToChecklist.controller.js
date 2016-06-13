fragileApp.controller('addMemberToChecklistController',['$scope','$rootScope','$stateParams','storyService','modalService','$uibModal','$uibModalInstance','$location','param','Socket',function($scope,$rootScope,$stateParams,storyService,modalService,$uibModal,$uibModalInstance,$location,param,Socket){
      var socket = Socket($scope);

		 
$scope.assignedMember=[];
$scope.currentItemId=param.listItem._id;

  $scope.initLoadMembersOfItem=function(){
    $scope.assignedMember=$scope.assignedMember.concat(param.listItem.assignedMember);
    console.log("yahoooooooo,: ",$scope.assignedMember);
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
  
      socket.emit('story:addRemoveMembersListItem',{"roomName":param.roomName,"memberObj":memberObj,"listObj":param.listItem});


          console.log("i have reached",param.listItem.assignedMember);
   
   
  }//addRemoveMembersList

    $scope.cancel=function(){
    //Use it for dismisal of modal
    $uibModalInstance.dismiss('cancel');
  }

   //
      socket.on('memberAdded',function(data){
        console.log("event recieved");
        if(data.listObj._id===$scope.currentItemId){
          //console.log("adding in assigned member list");

         $scope.assignedMember.push(data.memberObj);
         }
       });

	}]);//end of main app