fragileApp.controller('loginController',['$scope','$state','$rootScope',function($scope,$state,$rootScope){
  $rootScope.userID  = "570395a239dc5fbac028505c"; //TODO: get userID after login
  $state.go('project', { userID : '570395a239dc5fbac028505c' });
  //To check user logged in or not  business logic goes here....
}]);
