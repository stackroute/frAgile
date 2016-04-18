fragileApp.controller('loginController',['$scope','$state','$rootScope',function($scope,$state,$rootScope){
  $rootScope.userID  = "570395a239dc5fbac028505c"; //TODO: get userID after login
  $rootScope.fullName ="Bruce Wayne";
  $scope.x = "QQQQ";
  $rootScope.list = [
  {
    "group": "inProgress",
    "listName": "Picked",
    "stories": []
  },
  {
    "group": "inProgress",
    "listName": "In progress",
    "stories": []
  },
  {
    "group": "inProgress",
    "listName": "For Review",
    "stories": []
  },
  {
    "group": "inProgress",
    "listName": "Approved",
    "stories": []
  },
  {
    "group": "Releasable",
    "listName": "Releasable",
    "stories": []
  }
];
  $scope.goToProject = function() {
    $state.go('project', { userID : $scope.userID });
  }
  $state.go('project', { userID : $scope.userID });
  //To check user logged in or not  business logic goes here....
}]);
