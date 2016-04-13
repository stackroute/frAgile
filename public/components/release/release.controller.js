fragileApp.controller('releaseController', ['$scope', '$rootScope', '$stateParams', '$state', 'releaseService', '$uibModal', 'socket', '$state', function($scope, $rootScope, $stateParams, $state, releaseService, $uibModal, socket, $state) {

  $scope.$on('$destroy', function() {
    socket.removeListener();
  });


  $scope.roomName = "release:" + $scope.release.id;
  socket.emit('join:room', {
    'room': $scope.roomName,
    'activityRoom': 'activity:' + $scope.projectID
  });


  socket.on('release:sprintAdded', function(data) {
    $scope.sprints.push(data);
     //Emitting activity data to be added

    var data = {
      room: 'activity:' + $scope.projectID,
      action: "added",
      projectID: $scope.projectID,
      user: {
        '_id': $scope.userID,
        'fullName': $scope.fullName
      },
      object: {
        name: data.name,
        type: "Sprint",
        _id: data._id
      },
      target: {
        name: $scope.release.name,
        type: "Release",
        _id: $scope.release.id
      }
    }
    socket.emit('addActivity', data);
  });

  socket.on('sprintDeleted', function(data) {
    $scope.sprints.forEach(function(sprint){
      if(sprint._id == data.sprintId){
        console.log('Sprint Deleted');
        $scope.sprints.pop();
      }
    })
  })

  $scope.backClick = function() {
    $state.go('project', {
      userID: $scope.userID
    });
  }

  $scope.openModal = function() {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/components/release/release.modal.html',
      controller: 'modalReleaseController',
    });
  }

  $scope.getSprints = function() {
    // $scope.projectID = $stateParams.prId;
    releaseService.getSprints($scope.release.id).success(function(response) {
      $scope.sprints = response[0].release[0].sprints;
    });

    // Menu Click Event
    $rootScope.isMenu = true;
    $rootScope.SlideMenu = function() {
      $rootScope.isMenu = !$rootScope.isMenu;
      console.log('menu clicked', $scope.isMenu);
    }


  };

  $scope.archiveFun = function(releaseId, sprintId) {
    // console.log("Release: ", releaseId);
    socket.emit('deleteSprint', {
      'room': $scope.roomName,
      'projectId': $rootScope.projectID,
      'releaseId': releaseId,
      'sprintId': sprintId
    });
    console.log('Release Controller: ', $rootScope.projectID, releaseId, sprintId);
  };

  $scope.editFun = function(rel) {

  };
  $scope.starFun = function(rel) {
    console.log("starFun" + rel);
  };

}]);
