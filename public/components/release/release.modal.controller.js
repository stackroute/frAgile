fragileApp.controller('modalReleaseController', ['$scope', '$rootScope', 'releaseService', '$uibModal', '$uibModalInstance','socket', function($scope, $rootScope, releaseService, $uibModal, $uibModalInstance,socket) {

  $scope.closeThis = function() {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.roomName = "release:" + $rootScope.release.id;
  $scope.addSprint = function() {
      // Emit to refresh all other clients
      socket.emit('sprintAdded', {
        'room': $scope.roomName,
        'projectId': $rootScope.projectID,
        'releaseId': $rootScope.release.id,
        'name': $scope.newSprintName,
        'endDate': $scope.endDate,
        'startDate': $scope.startDate,
        'desc': $scope.newSprintDesc
      });

      $uibModalInstance.dismiss('cancel');

  }

}]);
