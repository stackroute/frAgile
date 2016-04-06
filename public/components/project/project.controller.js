fragileApp.controller('projectController',['$scope','$state','$rootScope','$stateParams','$uibModal','projectService','socket',function($scope,$state,$rootScope,$stateParams,$uibModal,projectService,socket){
  $scope.loadProjects = function(){
    projectService.getUserProjects($stateParams.userID).success(function(response){
      $scope.projects = response.projects
    });
  }

  $scope.longDescLimit = 40;
  $scope.setDefaultForRelease = function(projectId) {

    console.log(projectId);
    $scope.addWhat = "Release";
    $scope.projectId = projectId;
projectService.setData($scope.addWhat,projectId);
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/components/project/project.modal.html',
      controller : 'modalController',
      controllerAs:'modalContr'
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
      controller : 'modalController',
      controllerAs:'modalContr'
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

  // To be used in Releases View
  $scope.setProjectID = function(projectID){
    $rootScope.projectID = projectID;
  }
  // socket.on('project added', function(data) {
  //   console.log(data);
  //   console.log($scope.projects);
  //   //$scope.projects.push(data.projects[projects.length-1]);
  // });
  //
  // socket.on('release added', function(data) {
  //   $scope.projects.push(data);
  // });
}]);
