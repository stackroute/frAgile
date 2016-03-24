var app1 = angular.module("app1", []);
app1.controller('ctrl1', function($scope, $http) {
  $scope.val = "";
  $scope.release = {};
  $scope.jsnName = ["56ea78dd15eac2a96fedb5ec", "56ea78ea15eac2a96fedb5ee"];
  $http.get('/project?id=' + $scope.jsnName).success(function(response) {

        $scope.vis = "invisible";
        $scope.JsonData = response;
        $scope.loadRelease = function(releaseId){
          $scope.rel = releaseId;
          $scope.release = $scope.JsonData[$scope.pro].release[releaseId];
        }
        $scope.setProject = function(projectId){
          $scope.pro = projectId;

        }
    });

});
