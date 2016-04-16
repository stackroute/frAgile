fragileApp.controller('modalReleaseController', ['$scope', '$rootScope', 'releaseService', '$uibModal', '$uibModalInstance','Socket', function($scope, $rootScope, releaseService, $uibModal, $uibModalInstance,Socket) {

  var socket = Socket($scope);


  $scope.closeThis = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.addItem = function () {
    if ($scope.addMe != undefined && $scope.addMe.trim().length > 0) {
      $scope.listArray.splice($scope.listArray.length-1, 1);
      var list = {
      "group": "inProgress",
      "listName": $scope.addMe.trim(),
      "stories": []
    };
    var releasable = {
      "group": "Releasable",
      "listName": "Releasable",
      "stories": []
    };
    $scope.listArray.push(list);
    $scope.listArray.push(releasable);
    $scope.addMe = "";
    }

  };
  $scope.removeItem = function (listIndex) {
    if (listIndex == $scope.listArray.length-1) {

    }
    else
      $scope.listArray.splice(listIndex, 1);
  };
  $scope.getList = function() {
    $scope.listArray =  $rootScope.list;
    };
  $scope.roomName = "release:" + $rootScope.release.id;
  $scope.addSprint = function() {
      // Emit to refresh all other clients
      socket.emit('release:addSprint', {
        'room': $scope.roomName,
        'projectId': $rootScope.projectID,
        'releaseId': $rootScope.release.id,
        'releaseName' : $rootScope.release.name,
        'name': $scope.newSprintName,
        'endDate': $scope.endDate,
        'startDate': $scope.startDate,
        'desc': $scope.newSprintDesc,
        'list': $scope.listArray,
        'userID':$scope.userID,
        'fullName': $scope.fullName
      });

      $uibModalInstance.dismiss('cancel');

  }

}]);
