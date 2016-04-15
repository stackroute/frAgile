fragileApp.controller('projectController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'projectService', 'socket','$filter', function($scope, $state, $rootScope, $stateParams, $uibModal, projectService, socket,$filter) {
  $scope.loadProjects = function() {
    projectService.getUserProjects($stateParams.userID).success(function(response) {
      $rootScope.projects = response.projects
    });

  }

  socket.emit('join:room', {
    'room': 'projectRoom'
  });

  socket.on('releaseDeleted', function(releaseData) {
    $scope.projects.forEach(function(project) {
      if (project._id == releaseData.projectId) {
        project.release.forEach(function(release) {
          if (release._id == releaseData.releaseId) {
            var releaseName = release.name; //For activity
            project.release.pop();
            //Emitting activity data to be added
            var data = {
              room: "projectRoom",
              action: "deleted",
              projectID: project._id,
              user: {
                '_id': $scope.userID,
                'fullName': $scope.fullName
              },
              object: {
                name: releaseName,
                type: "Release",
                _id: releaseData.releaseId
              },
              target: {
                name: project.name,
                type: "Project",
                _id: project._id
              }
            }
            socket.emit('addActivity', data);
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
  };
  $scope.editFun = function(rel) {

  };
  $scope.starFun = function(rel) {
    console.log("starFun" + rel);
  };

  $scope.setProject = function(projectId, projectName, releaseId, releaseName, releaseDesc) {
    $rootScope.projectID = projectId;
    $rootScope.projectName = projectName,
    $rootScope.release = {};
    $rootScope.release.id = releaseId;
    $rootScope.release.name = releaseName;
    $rootScope.release.description = releaseDesc;
  }



  socket.on('project:releaseAdded', function(releaseData) {
    // Returns entire project document
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
