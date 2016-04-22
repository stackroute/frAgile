fragileApp.controller('releaseController', ['$scope', '$rootScope', '$stateParams', '$state', 'releaseService', '$uibModal', 'Socket', '$state','$timeout', 'graphModalFactory',
function($scope, $rootScope, $stateParams, $state, releaseService, $uibModal, Socket, $state, $timeout,graphModalFactory) {
  $scope.longDescLimit = 34;
  var socket = Socket($scope);

  $rootScope.projectID = $stateParams.prId //Remove this once refresh issue is fixed
  //currentProjectId
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
// Called from server when sprint is deleted
  socket.on('sprintDeleted', function(sprintData) {
    $scope.sprints.forEach(function(sprint) {
      if (sprint._id == sprintData.sprintId) {
        var sprintName = sprint.name; //For activity
        $scope.sprints.pop();
      }
    })
  })
// Open modal Window for Story
  $scope.openModal = function(name) {
    $rootScope.releaseName = name;
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
        $scope.curProjectLoc = projectKey;
        project.release.forEach(function(release, releaseKey) {
          if (release._id == $stateParams.releaseID) {
            $scope.curReleaseLoc = releaseKey;
          }
        });
      }
    });
    releaseService.getSprints($stateParams.releaseID).success(function(response) {
        $scope.sprints = response[0].release[0].sprints;
        console.log($scope.sprints);
        console.log("?????");
        console.log(response);
          // $rootScope.projects[projectKey].release[releaseKey].sprints = [];
          // $rootScope.projects[projectKey].release[releaseKey].sprints = response[0].release[0].sprints;
        });
    console.log("22222222222222222222222222");
    // releaseService.getSprints($stateParams.releaseID).success(function(response) {
    //   $scope.sprints = response[0].release[0].sprints;
    //   console.log($scope.sprints);
    //   console.log("33333333333333333333333");
    // });

    // Menu Click Event
    $rootScope.isMenu = false;
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
    graphModalFactory.open('lg','./components/release/graph_release/releaseGraph.html');
  };

}]);
