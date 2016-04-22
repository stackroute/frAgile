fragileApp.controller('releaseController', ['$scope', '$rootScope', '$stateParams', '$state', 'releaseService', '$uibModal', 'Socket', '$state','$timeout', 'graphModalFactory',
function($scope, $rootScope, $stateParams, $state, releaseService, $uibModal, Socket, $state, $timeout,graphModalFactory) {
  $scope.longDescLimit = 34;
  var socket = Socket($scope);

  $rootScope.projectID = $stateParams.prId //Remove this once refresh issue is fixed

  $scope.roomName = "release:" + $stateParams.releaseID;
  var emitData = {
    'room': $scope.roomName
  }
  if (!$scope.activityRoom || $scope.activityRoom != ('activity:' + $stateParams.prId)) { //Join an activity room if not already     joined || Change room if navigated from other project.
    $rootScope.activityRoom = 'activity:' + $stateParams.prId
    emitData["activityRoom"] = 'activity:' + $stateParams.prId
  }
  socket.emit('join:room', emitData);

  socket.on('release:sprintAdded', function(data) {
    $rootScope.projects[$rootScope.projectKey].release[$rootScope.releaseKey].sprints.push(data);
  });

    socket.on('release:sprintEdited', function(sprintData) {
      $rootScope.projects[$rootScope.projectKey].release[$rootScope.releaseKey].sprints.forEach(function(item, itmIndex) {
        if(item._id == sprintData._id){
          $rootScope.projects[$rootScope.projectKey].release[$rootScope.releaseKey].sprints[itmIndex].name = sprintData.name;
          $rootScope.projects[$rootScope.projectKey].release[$rootScope.releaseKey].sprints[itmIndex].description = sprintData.description;
          $rootScope.projects[$rootScope.projectKey].release[$rootScope.releaseKey].sprints[itmIndex].startDate = sprintData.startDate;
          $rootScope.projects[$rootScope.projectKey].release[$rootScope.releaseKey].sprints[itmIndex].endDate = sprintData.endDate;
        }
      });
      //console.log(releaseData);
    });

  socket.on('sprintDeleted', function(sprintData) {
    $rootScope.projects[$rootScope.projectKey].release[$rootScope.releaseKey].sprints.forEach(function(sprint) {
      if (sprint._id == sprintData.sprintId) {
        var sprintName = sprint.name; //For activity
        $rootScope.projects[$rootScope.projectKey].release[$rootScope.releaseKey].sprints.pop();
      }
    })
  })

  $scope.openModal = function(name) {
    $rootScope.release.name = name;
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
        "projectID" : $stateParams.prId
      });
      return true;
    }
    else {
      return false;
    }
  }


  $scope.getSprints = function() {
    $scope.relId = $stateParams.releaseID;
    $rootScope.projects.forEach(function(project, projectKey) {
      if (project._id == $stateParams.prId) {
        $rootScope.projectKey = projectKey;
        console.log("found project " + $stateParams.prId);
        project.release.forEach(function(release, releaseKey) {
          if (release._id == $stateParams.releaseID) {
            $rootScope.releaseKey = releaseKey;
          }
        });
      }
    });
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
      'projectId': $stateParams.prId,
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
  $scope.openReleaseStatus = function(){
    graphModalFactory.open('lg','./components/release/graph_release/releaseGraph.html',"Release Graph");
  };

}]);
