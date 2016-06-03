fragileApp.controller('addMemberToChecklistController',['$scope','$rootScope','$stateParams','storyService','modalService','$uibModal','$uibModalInstance','$location','param','Socket',function($scope,$rootScope,$stateParams,storyService,modalService,$uibModal,$uibModalInstance,$location,param,Socket){

		 

	$scope.initLoadMembersOfStory = function(){
    //$scope.memberDetails= param.projMembers;

    /*** Declaring variables required for addMembers,addLabels***/
    $scope.longDescLimit=25 ;
    $scope.checked = true;
    $scope.membersData = [];
    /** XHR request to fetch latest members details***/
    //console.log($scope.storyDetails._id);
    $scope.storyMember=param.members;
   // console.log("Params",param.listItem);

  }//end of init load member
    //nitish
  $scope.addRemoveMembersList=function(memberObj){
    //compare the memberObj with the memberlist in the story collection and check process accordingly.
    //TODO:checking if the member is already in the story.once the user is removed, it has to send add members request but it is not because initial story member list is brought using resolve. when parent gets updated then child is not . So add one more lisner in sub modal to update the list available with submodal
    // var userObj = $scope.storyDetails.memberList.filter(function ( obj ) {
    //   return obj._id === memberObj._id;
    // })[0];

  		param.listItem.assignedMember.push(memberObj);

  		console.log(" in stoy operation Add remove",param.listItem);

  		console.log("Heyyyyyyyyyyyyy",param.listItem.assignedMember);
   
  }//addRemoveMembersList

    $scope.cancel=function(){
    //Use it for dismisal of modal
    $uibModalInstance.dismiss('cancel');
  }



	}]);//end of main app