fragileApp.controller('homeController', ['$scope', '$state', '$rootScope', 'homeService', '$filter','Socket', function($scope, $state, $rootScope, homeService, $filter,socket) {

  $scope.loadProjects = function() {

    homeService.getUserProjects().success(function(response) {
      $rootScope.projects = response.projects
    });

    $rootScope.refreshProjects = false;
    $rootScope.defaultDate = $filter('date')(Date.now(), "yyyy-MM-dd");
  };

  homeService.getCurrentUser().success(function(response) {
    $rootScope.currentUserID = response._id;
    $rootScope.currentUserEmail = response.email;
  })

  $rootScope.list = [{
    "group": "inProgress",
    "listName": "Picked",
    "stories": []
  }, {
    "group": "inProgress",
    "listName": "In progress",
    "stories": []
  }, {
    "group": "inProgress",
    "listName": "For Review",
    "stories": []
  }, {
    "group": "inProgress",
    "listName": "Approved",
    "stories": []
  }, {
    "group": "Releasable",
    "listName": "Releasable",
    "stories": []
  }];
  $scope.goToProject = function() {
    $state.go('project');
  }
  $state.go('project');
  //To check user logged in or not  business logic goes here....
}]);
