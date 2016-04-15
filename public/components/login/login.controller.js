fragileApp.controller('loginController',['$scope','$state','$rootScope',function($scope,$state,$rootScope){
  $rootScope.userID  = "570395a239dc5fbac028505c"; //TODO: get userID after login
  $rootScope.fullName ="Bruce Wayne";

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
  $state.go('project', { userID : '570395a239dc5fbac028505c' });
  //To check user logged in or not  business logic goes here....
}]);
