fragileApp.controller('sprintController', ['$scope', '$rootScope', '$stateParams', 'sprintService', function($scope, $rootScope, $stateParams, sprintService) {
  $scope.getSprints = function() {
    sprintService.getSprints($stateParams.sprintID).then(function(sprint) {
      $scope.sprint = sprint.data;
      $scope.sprintWidth = ($scope.sprint.list.length * 278 + 560) + "px";
      $scope.sprint = sprint.data;
    });

    sprintService.getBackBug($scope.projectID).then(function(backBug) {
      $scope.backBug = backBug.data;
      // console.log(projects);
    });

  };

}]);
