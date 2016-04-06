fragileApp.controller('releaseController',['$scope','$rootScope','$stateParams','releaseService',function($scope,$rootScope,$stateParams,releaseService){
  $scope.getSprints = function() {

    $scope.release = $stateParams.releaseID;

    releaseService.getSprints($stateParams.releaseID).success(function(response){
      $scope.sprints = response[0].release[0].sprints;
    });

    // Menu Click Event
    $scope.isMenu = true;
    $scope.SlideMenu = function(){
      $scope.isMenu = !$scope.isMenu;
    }

  };

}]);
