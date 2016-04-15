  fragileApp.controller('storyOperationsController',['$scope','$rootScope','$stateParams','storyService','modalService','$uibModal','$uibModalInstance','$location','param',function($scope,$rootScope,$stateParams,storyService,modalService,$uibModal,$uibModalInstance,$location,param){

/***Received the data from resolve functionality of uibModal***/
  $scope.storyDetails= param.story.data;
  $scope.sprintDetails= param.sprint;
  $scope.memberDetails= param.projMembers;
  //TODO:need to check whether we need to get the "$scope.memberDetails" data directly from rootscope without resolving it in story Modal.

/*** Declaring variables required for addMembers,addLabels***/
  $scope.longDescLimit=25 ;
  $scope.checked = true;

  console.log($scope.storyDetails);
  console.log($scope.sprintDetails);
  console.log($scope.memberDetails);

  /***
  author:Sharan
  Function Name: addChecklistGroup
  Function Description: This method is called by sub-Modal window of checklist.It creates a new checklist group in the particular story and pushes the delta value to server.
  Parameters:None

  TODO:Presently we are not hitting the server for updating the data and pushing to model directly. Need to update the logic
***/
  $scope.addChecklistGroup = function() {
    $scope.storyDetails.checklist.push({
    checklistHeading:$scope.todoGroupText ,
    checkedCount:0,
    items:[{text:'learn angular', checked:false,createdBy:'userId',creatorName:'Sharan'},
    {text:'build an angular app', checked:false,createdBy:'userId',creatorName:'Sharan'}]
    });
    $scope.todoText = '';
    $uibModalInstance.dismiss('cancel');
  };

  $scope.toggleLabel=function(){
    $scope.checked=!$scope.checked;
  }
}]);
