fragileApp.controller('projectController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'projectService', 'Socket','$filter', 'graphModalFactory',
function($scope, $state, $rootScope, $stateParams, $uibModal, projectService, Socket,$filter,graphModalFactory) {
  // $scope.loadProjects = function() {
  //
  //   projectService.getUserProjects().success(function(response) {
  //     $rootScope.projects = response.projects
  //   });
  //
  //   $rootScope.defaultDate =  $filter('date')(Date.now(), "yyyy-MM-dd");
  // }
  var socket = Socket($scope);

  socket.emit('join:room', {
    'room': "user:" + $scope.currentUserID
  });

  socket.on('releaseDeleted', function(releaseData) {
    $rootScope.projects.forEach(function(project) {
      if (project._id == releaseData.projectId) {
        project.release.forEach(function(release, index) {
          if (release._id == releaseData.releaseId) {
            var releaseName = release.name; //For activity
            project.release.splice(index,1);
          }
        })
      }
    })
  })

  // Opening Modal window for Release Chart
  $scope.openReleaseChart = function() {
      graphModalFactory.open('lg','./components/releaseChart/releaseChart.html',"Release Chart");
    };

    // Opening Modal window for Overview Chart
  $scope.showOverGraph = function() {
      graphModalFactory.open('lg','./components/releaseChart/overViewChart.html',"Overview Graph");
    };

  $scope.longDescLimit = 38;
  $scope.longPrjDescLimit = 120;
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
  $scope.editRelease = function(newReleaseName,newReleaseDetails,newReleaseDate,creationDate,prId,relId,oldName) {
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
        "releaseDate": dt,
        "oldReleaseName" : oldName
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
    $rootScope.projectName = projectName,
    $rootScope.release = {};
    $rootScope.releaseName = releaseName;
    $rootScope.release.description = releaseDesc;
  }

  socket.on('project:releaseEdited', function(releaseData) {
    console.log(releaseData);
    console.log("--------------");
    $rootScope.projects.forEach(function(item, itmIndex) {
      if(item._id == releaseData.prId){
        item.release.forEach(function(rel, relIndex) {
          if(rel._id == releaseData._id){
            console.log($rootScope.projects[itmIndex].release[relIndex]);
            $rootScope.projects[itmIndex].release[relIndex].name = releaseData.name;
            $rootScope.projects[itmIndex].release[relIndex].description = releaseData.description;
            $rootScope.projects[itmIndex].release[relIndex].releaseDate = releaseData.releaseDate;
          }
        });
      }
    });
    //console.log(releaseData);
  });

  socket.on('project:releaseAdded', function(releaseData) {
    // Returns entire project document
    $rootScope.projects.forEach(function(item, index) {
      if (item._id == releaseData._id) { //Comparing  Scope Projects ID with Updated Project ID
        $rootScope.projects[index] = releaseData;

      }
    });
  });

  socket.on('project:projectAdded',function(data){
    $rootScope.projects.push(data);
  });

}]);
