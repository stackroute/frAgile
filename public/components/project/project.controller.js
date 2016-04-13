fragileApp.controller('projectController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'projectService', 'socket', function($scope, $state, $rootScope, $stateParams, $uibModal, projectService, socket) {
  $scope.loadProjects = function() {
    projectService.getUserProjects($stateParams.userID).success(function(response) {
      $rootScope.projects = response.projects
    });
  }

  socket.on('releaseDeleted', function(data) {
    $scope.projects.forEach(function(project) {
      if (project._id == data.projectId) {
        project.release.forEach(function(release) {
          if (release._id == data.releaseId) {
            project.release.pop();
          }
        })
      }
    })
  })

  $scope.longDescLimit = 40;
  $scope.setDefaultForRelease = function(projectId) {

    $scope.addWhat = "Release";
    $scope.projectId = projectId;
    projectService.setData($scope.addWhat, projectId);
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/components/project/project.modal.html',
      controller: 'modalController',
      controllerAs: 'modalContr'
    });
  }
  $scope.setDefaultForProject = function(projectId) {
    $scope.dismissThis = "none";
    $scope.addWhat = "Project";
    $scope.warningModalDesc = true;
    $scope.warningModalName = true;
    $scope.warningModalDate = true;
    projectService.setData($scope.addWhat);
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/components/project/project.modal.html',
      controller: 'modalController',
      controllerAs: 'modalContr'
    });
  }

  $scope.archiveFun = function(projectId, releaseId) {
    // console.log("archiveFun" + rel)
    socket.emit('deleteRelease', {
      'room': 'projectRoom',
      'projectId': projectId,
      'releaseId': releaseId
    });
    console.log('Project Controller: ', projectId, releaseId);
  };
  $scope.editFun = function(rel) {

  };
  $scope.starFun = function(rel) {
    console.log("starFun" + rel);
  };

  $scope.setProject = function(id, releaseID, name, desc) {
    $rootScope.projectID = id;
    $rootScope.release = {};
    $rootScope.release.id = releaseID;
    $rootScope.release.name = name;
    $rootScope.release.description = desc;
  }

  socket.emit('join:room', {
    'room': 'projectRoom'
  });

  socket.on('project:releaseAdded', function(releaseData) {
    $scope.projects.forEach(function(item, index) {
      if (item._id == releaseData._id) { //Comparing  Scope Projects ID with Updated Project ID
        $scope.projects[index] = releaseData;

        //Emitting activity data to be added

        var data = {
          room: "projectRoom",
          action: "added",
          projectID: releaseData._id,
          user: {
            '_id': $scope.userID,
            'fullName': $scope.fullName
          },
          object: {
            name: releaseData.release[releaseData.release.length -1].name,
            type: "Release",
            _id: releaseData.release[releaseData.release.length -1]._id
          },
          target: {
            name: releaseData.name,
            type: "Project",
            _id: releaseData._id
          }
        }
        socket.emit('addActivity', data);

      }
    });
  });


}]);
