fragileApp.controller('releaseController', ['$scope', '$rootScope', '$stateParams', '$state', 'releaseService', '$uibModal', 'Socket', '$state', function($scope, $rootScope, $stateParams, $state, releaseService, $uibModal, Socket, $state) {

  var socket = Socket($scope);

  $scope.roomName = "release:" + $scope.release.id;
  var emitData = {
    'room': $scope.roomName
  }
  if (!$scope.activityRoom || $scope.activityRoom != ('activity:' + $scope.projectID)) { //Join an activity room if not already     joined || Change room if navigated from other project.
    $rootScope.activityRoom = 'activity:' + $scope.projectID
    emitData["activityRoom"] = 'activity:' + $scope.projectID
  }
  socket.emit('join:room', emitData);

  socket.on('release:sprintAdded', function(data) {
    $scope.sprints.push(data);
  });

  socket.on('sprintDeleted', function(sprintData) {
    $scope.sprints.forEach(function(sprint) {
      if (sprint._id == sprintData.sprintId) {
        var sprintName = sprint.name; //For activity
        $scope.sprints.pop();
        //Emitting activity data to be added
        var data = {
          room: 'activity:' + $scope.projectID,
          action: "deleted",
          projectID: $rootScope.projectID,
          user: {
            '_id': $scope.userID,
            'fullName': $scope.fullName
          },
          object: {
            name: sprintName,
            type: "Sprint",
            _id: sprintData.sprintId
          },
          target: {
            name: $rootScope.projectName,
            type: "Project",
            _id: $rootScope.projectID
          }
        }
        socket.emit('addActivity', data);
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
