fragileApp.controller('modalController', ['$scope', '$rootScope', '$stateParams', 'projectService', '$uibModal', '$uibModalInstance', '$location','socket' ,function($scope, $rootScope, $stateParams, projectService, $uibModal, $uibModalInstance, $location,socket) {
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
        projectService.addProjectToUser($scope.userID, response._id).success(function(data) {

          //Pushing added object into the scope to display
          $scope.projects.push(data[0]);

          //Emitting add activity event
          var data = {
            room: "projectRoom",
            action: "created",
            projectID: data[0]._id,
            user: {
              '_id': $scope.userID,
              'fullName': $scope.fullName
            },
            target: {
              name: data[0].name,
              type: "Project",
              _id: data[0]._id
            }
          }
          socket.emit('addActivity', data);


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

      //Emitting release data to be added
      data = {
        room:'projectRoom',
        projectID: modalContr.addId,
        name: $scope.newReleaseName,
        desc: $scope.newReleaseDesc,
        dt: $scope.newReleaseDate
      }
      socket.emit('project:addRelease', data);

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
