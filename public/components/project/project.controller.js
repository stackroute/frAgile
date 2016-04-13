fragileApp.controller('projectController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'projectService', 'socket',function($scope, $state, $rootScope, $stateParams, $uibModal, projectService, socket) {
  $scope.loadProjects = function() {
    projectService.getUserProjects($stateParams.userID).success(function(response) {
      $rootScope.projects = response.projects
    });
  }

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

  $scope.archiveFun = function(rel) {
    console.log("archiveFun" + rel);
  };
  $scope.editFun = function(rel) {

  };
  $scope.starFun = function(rel) {
    console.log("starFun" + rel);
  };

  $scope.setProject= function(id,releaseID,name,desc){
    $rootScope.projectID = id;
    $rootScope.release = {};
    $rootScope.release.id = releaseID;
    $rootScope.release.name = name;
    $rootScope.release.description = desc;
  }

  socket.emit('join:room', {'room': 'projectRoom'});

  socket.on('project:release added',function(data){
    $scope.projects.forEach(function(item,index){
      if(item._id == data._id){ //Comparing  Scope Projects ID with Updated Project ID
        $scope.projects[index] = data;
      }
    });
  });


}]);
