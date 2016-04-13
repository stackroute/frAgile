fragileApp.controller('releaseController', ['$scope', '$rootScope', '$stateParams', 'releaseService', '$uibModal','socket','$state', function($scope, $rootScope, $stateParams, releaseService, $uibModal,socket,$state) {
  // miscService.leaveRoom('projectRoom', 'project');
  $scope.roomName = "release:" + $scope.release.id;
  socket.emit('join:room', { 'room': $scope.roomName});

  socket.on('sprintAdded', function(data) {
    $scope.sprints.push(data);
  });

  $scope.backClick = function(){
    $state.go('project', { userID : $scope.userID });
  }

  $scope.openModal = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/components/release/release.modal.html',
      controller: 'modalReleaseController',
      });
  }

  $scope.getSprints = function() {


    releaseService.getSprints($scope.release.id).success(function(response) {
      $scope.sprints = response[0].release[0].sprints;
    });

    // Menu Click Event
    $rootScope.isMenu = true;
    $rootScope.SlideMenu = function() {
      $scope.isMenu = !$scope.isMenu;
    }


  };

}]);
