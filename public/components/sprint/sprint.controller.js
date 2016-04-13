fragileApp.controller('sprintController', ['$scope', '$rootScope', '$stateParams', 'sprintService', '$state', function($scope, $rootScope, $stateParams, sprintService, $state) {
  $scope.getSprints = function() {
    sprintService.getSprints($stateParams.sprintID).then(function(sprint) {
      $scope.sprint = sprint.data;
      $scope.sprintWidth = ($scope.sprint.list.length * 278 + 560) + "px";
      $scope.sprint = sprint.data;
    });
    $scope.projectID = $rootScope.projectID
    sprintService.getBackBug($stateParams.prId).then(function(backBug) {
      $scope.backBug = backBug.data;
      // console.log(projects);
    });

  };

  $scope.backClick = function(){
    console.log("Back");
    $state.go('release', { prId : $stateParams.prId, releaseID: $rootScope.release.id});
  }
}]);
