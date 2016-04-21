angular.module('fragileApp').controller('graphModalController',['$scope','$rootScope','graphModalFactory','componentTemplate','$uibModalInstance','$compile',function($scope,$rootScope,graphModalFactory,componentTemplate,$uibModalInstance,$compile){

  $scope.template = componentTemplate;

  $scope.closeGraph = function() {
    $uibModalInstance.dismiss('cancel');
  }
}]);
