fragileApp.controller('modalController', ['$scope', '$rootScope', '$stateParams', 'projectService', '$uibModal', '$uibModalInstance', '$location', function($scope, $rootScope, $stateParams, projectService, $uibModal, $uibModalInstance, $location) {
  $scope.dismissThis = "none";
  $scope.warningModalDesc = true;
  $scope.warningModalName = true;
  $scope.warningModalDate = true;

  // var story = this;
  // story.items =boardFactory.storyData;
  var modalContr = this;
  modalContr.addWhat = projectService.addWhat;
  modalContr.addId = projectService.addId;
  $scope.AddNewProject = function() {
    if ($scope.newReleaseName == undefined || $scope.newReleaseName == "") {
      $scope.warningModalName = false;
    } else {
      $scope.warningModalName = true;
    }
    if ($scope.newReleaseDesc == undefined || $scope.newReleaseDesc == "") {
      $scope.warningModalDesc = false;
    } else {
      $scope.warningModalDesc = true;
    }
    if ($scope.newReleaseName != undefined && $scope.newReleaseName != "" &&
      $scope.newReleaseDesc != undefined && $scope.newReleaseDesc != ""
    ) {
      projectService.addProject($scope.newReleaseName, $scope.newReleaseDesc).success(function(response) {
        projectService.addProjectToUser($scope.userID, response._id).success(function(data){
          $scope.projects.push(data[0]);
        });
      });
      $scope.dismissThis = "modal";
      $scope.newReleaseName = "";
      $scope.newReleaseDesc = "";
      $uibModalInstance.dismiss('cancel');
    }
  }
  $scope.AddNewRelease = function() {

    if ($scope.newReleaseName == undefined || $scope.newReleaseName == "") {
      $scope.warningModalName = false;
    } else {
      $scope.warningModalName = true;
    }
    if ($scope.newReleaseDesc == undefined || $scope.newReleaseDesc == "") {
      $scope.warningModalDesc = false;
    } else {
      $scope.warningModalDesc = true;
    }
    if ($scope.newReleaseDate == undefined || $scope.newReleaseDate == "") {
      $scope.warningModalDate = false;
    } else {
      $scope.warningModalDate = true;
    }
    if ($scope.newReleaseName != undefined && $scope.newReleaseName != "" &&
      $scope.newReleaseDesc != undefined && $scope.newReleaseDesc != "" &&
      $scope.newReleaseDate != undefined && $scope.newReleaseDate != ""
    ) {
      projectService.addRelease(modalContr.addId, $scope.newReleaseName, $scope.newReleaseDesc, $scope.newReleaseDate);
      // projectService.addRelease(modalContr.addId, $scope.newReleaseName, $scope.newReleaseDesc, $scope.newReleaseDate).success(function(response){
      //   //console.log(response);
      // });
      $scope.dismissThis = "modal";
      $scope.newReleaseName = "";
      $scope.newReleaseDesc = "";
      $scope.newReleaseDate = "";
      $uibModalInstance.dismiss('cancel');
    }
  }
  $scope.closeThis = function() {
    $uibModalInstance.dismiss('cancel');
  }


}]);
