fragileApp.controller('projectController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'projectService', 'Socket','$filter', function($scope, $state, $rootScope, $stateParams, $uibModal, projectService, Socket,$filter) {
  $scope.loadProjects = function() {

    projectService.getUserProjects().success(function(response) {
      $rootScope.projects = response.projects
    });

    $rootScope.defaultDate =  $filter('date')(Date.now(), "yyyy-MM-dd");
  }
  var socket = Socket($scope);

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

          }
        })
      }
    })
  })

  $scope.longDescLimit = 38;
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
  $scope.editRelease = function(newReleaseName,newReleaseDetails,newReleaseDate,creationDate,prId,relId) {
      if (newReleaseDate != null && creationDate != null && newReleaseName != "") {
      var dt = new Date(newReleaseDate);
      var crDt = new Date(creationDate);
      socket.emit('project:editRelease', {
        'room': 'projectRoom',
        'projectId': prId,
        'releaseId': relId,
        "name": newReleaseName,
        "description": newReleaseDetails,
        "creationDate": crDt,
        "releaseDate": dt
      });
      return true;
    }
    else{
      return false;
    }
  }
  $scope.archiveFun = function(projectId, releaseId,projectName,releaseName) {
    // console.log("archiveFun" + rel)
    socket.emit('deleteRelease', {
      'room': 'projectRoom',
      'activityRoom' : 'activity:' + projectId,
      'projectId': projectId,
      'releaseId': releaseId,
      'releaseName': releaseName,
      'projectName' : projectName
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

  socket.on('project:releaseEdited', function(releaseData) {
    console.log(releaseData);
    console.log("--------------");
    $scope.projects.forEach(function(item, itmIndex) {
      if(item._id == releaseData.prId){
        item.release.forEach(function(rel, relIndex) {
          if(rel._id == releaseData._id){
            console.log($scope.projects[itmIndex].release[relIndex]);
            $scope.projects[itmIndex].release[relIndex].name = releaseData.name;
            $scope.projects[itmIndex].release[relIndex].description = releaseData.description;
            $scope.projects[itmIndex].release[relIndex].releaseDate = releaseData.releaseDate;
          }
        });
      }
    });
    //console.log(releaseData);
  });

  socket.on('project:releaseAdded', function(releaseData) {
    // Returns entire project document
    $scope.projects.forEach(function(item, index) {
      if (item._id == releaseData._id) { //Comparing  Scope Projects ID with Updated Project ID
        $scope.projects[index] = releaseData;

      }
    });
  });


}]);
