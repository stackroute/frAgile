fragileApp.controller('releaseController', ['$scope', '$rootScope', '$stateParams', '$state', 'releaseService', '$uibModal', 'Socket', '$state','$timeout', function($scope, $rootScope, $stateParams, $state, releaseService, $uibModal, Socket, $state, $timeout) {
  $scope.longDescLimit = 34;
  var socket = Socket($scope);

  $scope.roomName = "release:" + $stateParams.releaseID;
  var emitData = {
    'room': $scope.roomName
  }
  if (!$scope.activityRoom || $scope.activityRoom != ('activity:' + $scope.projectID)) { //Join an activity room if not already     joined || Change room if navigated from other project.
    $rootScope.activityRoom = 'activity:' + $scope.projectID
    emitData["activityRoom"] = 'activity:' + $scope.projectID
  }
  socket.emit('join:room', emitData);

  socket.on('release:sprintAdded', function(data) {
    $scope.sprints.push(data);
  });

    socket.on('release:sprintEdited', function(sprintData) {
      $scope.sprints.forEach(function(item, itmIndex) {
        if(item._id == sprintData._id){
          $scope.sprints[itmIndex].name = sprintData.name;
          $scope.sprints[itmIndex].description = sprintData.description;
          $scope.sprints[itmIndex].startDate = sprintData.startDate;
          $scope.sprints[itmIndex].endDate = sprintData.endDate;
        }
      });
      //console.log(releaseData);
    });

  socket.on('sprintDeleted', function(sprintData) {
    $scope.sprints.forEach(function(sprint) {
      if (sprint._id == sprintData.sprintId) {
        var sprintName = sprint.name; //For activity
        $scope.sprints.pop();
      }
    })
  })

  $scope.backClick = function() {
    $state.go('project', {
      userID: $scope.userID
    });
  }

  $scope.openModal = function() {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/components/release/release.modal.html',
      controller: 'modalReleaseController',
    });
  }
  $scope.editSprint = function(newSprintName,newSprintDetails,newSprintStartDate,newSprintEndDate,sprId,oldName) {
    if (newSprintStartDate != "") {
      // console.log("newSprintStartDate is not null it is -" + newSprintStartDate +"-");
    }
    if (newSprintName != "" && newSprintStartDate != null && newSprintEndDate != null) {
    newSprintStartDate = new Date(newSprintStartDate);
    newSprintEndDate = new Date(newSprintEndDate);
      socket.emit('release:editSprint', {
        "room": $scope.roomName,
        "sprintId": sprId,
        "name": newSprintName,
        "description": newSprintDetails,
        "startDate": newSprintStartDate,
        "endDate": newSprintEndDate,
        "oldName": oldName,
        "projectID" : $scope.projectID
      });
      return true;
    }
    else {
      return false;
    }
  }


  $scope.getSprints = function() {
    $scope.projectID = $stateParams.prId;
    $scope.relId = $stateParams.releaseID;

    $rootScope.projects.forEach(function(project, projectKey) {
      if (project._id == $stateParams.prId) {
        $scope.projectKey = projectKey;
        console.log("found project " + $stateParams.prId);
        project.release.forEach(function(release, releaseKey) {
          if (release._id == $stateParams.releaseID) {
            $scope.releaseKey = releaseKey;
          }
        });
      }
    });
    console.log("111111111111111111111");
    console.log($scope.sprints);
    console.log("22222222222222222222222222");
    // releaseService.getSprints($stateParams.releaseID).success(function(response) {
    //   $scope.sprints = response[0].release[0].sprints;
    //   console.log($scope.sprints);
    //   console.log("33333333333333333333333");
    // });

    // Menu Click Event
    $rootScope.isMenu = true;
    $rootScope.SlideMenu = function() {
      $rootScope.isMenu = !$rootScope.isMenu;
    }



  };

  $scope.archiveFun = function(releaseId, sprintId,relName,sprName) {
    // console.log("Release: ", releaseId);
    socket.emit('deleteSprint', {
      'room': $scope.roomName,
      'projectId': $rootScope.projectID,
      'releaseId': releaseId,
      'sprintId': sprintId,
      'releaseName':relName,
      'sprintName' : sprName
    });
  };

  $scope.editFun = function(rel) {

  };
  $scope.starFun = function(rel) {
    // console.log("starFun" + rel);
  };

}]);
