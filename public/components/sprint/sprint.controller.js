fragileApp.controller('sprintController', ['$scope', '$rootScope', '$stateParams', 'sprintService', '$state', 'socket', function($scope, $rootScope, $stateParams, sprintService, $state, socket) {
  $scope.getSprints = function() {
    $scope.addToBacklog = false;
    $scope.addToBuglist = false;
    sprintService.getSprints($stateParams.sprintID).then(function(sprint) {
      $scope.sprint = sprint.data;
      $scope.sprintWidth = ($scope.sprint.list.length * 278 + 560) + "px";
      $scope.sprint = sprint.data;
    });
    sprintService.getBackBug($stateParams.prId).then(function(backBug) {
      $scope.backBug = backBug.data;
    });

    $rootScope.isMenu = false;
    $rootScope.SlideMenu = function() {
      $rootScope.isMenu = !$rootScope.isMenu;
    }

    $rootScope.projectID = $stateParams.projectID;

  };

  $scope.roomName = "sprint:" + $stateParams.sprintID
  socket.emit('join:room', {
    'room': $scope.roomName,
    'activityRoom': 'activity:' + $stateParams.prId
  });

  $scope.backClick = function() {
    $state.go('release', {
      prId: $stateParams.prId,
      releaseID: $rootScope.release.id
    });
  }

  socket.on('sprint:storyAdded', function(data) {
    if(data.listId == "BugLists"){
      $scope.backBug.buglist.stories.push(data);
    }
    else if (data.listId == "Backlogs") {
      $scope.backBug.backlogs.stories.push(data);
    }
    else {
      angular.forEach($scope.sprint.list, function(value, key) {
        if (value._id == $scope.listIdAdded) {
          $scope.sprint.list[key].stories.push(data);
        }
      });
    }
    // $scope.sprint.push(data);
  });

$scope.test = function(listId, clicked) {
    $scope.clicked=false;
  };
  $scope.show = function(listId, bool) {
    return listId+bool;
  };
  $scope.addStory = function(listId, storyDetails, id) {
    $scope.listIdAdded = id;
    if(storyDetails != undefined && storyDetails != ""){
      socket.emit('sprint:addStory', {
        'room': $scope.roomName,
        'addTo': listId,
        'projectId': $stateParams.prId,
        'storyStatus':"",
        'sprintId': $stateParams.sprintID,
        'heading':  storyDetails,
        'description': "",
        'listId': listId,
        'id':id
      });
      $scope.storyDetails = "";
      $scope.addToBacklog = false;
      $scope.addToBuglist = false;
    }
  }
  $scope.showBacklogAddDetails = function() {
    $scope.addToBacklog = true;
  };
  $scope.hideBacklogAddDetails = function() {
    $scope.addToBacklog = false;
  };
  $scope.showBuglistAddDetails = function() {
    $scope.addToBuglist = true;
  };
  $scope.hideBuglistAddDetails = function() {
    $scope.addToBuglist = false;
  };


  var divBeingDragged = "",
    elemBeingDragged = "";

  $scope.dropCallback = function(event, ui) {
    //Called when story is dropped in list
    angular.element(event.target).removeClass("being-dropped")

    socket.emit('sprint:moveStory', {
      'room': $scope.roomName,
      'sprintId': $stateParams.sprintID,
      'oldListId': divBeingDragged[0].id,
      'newListId': angular.element(event.target)[0].id,
      'storyId': elemBeingDragged[0].id
    });

  };
  $scope.startCallback = function(event, ui) {
    angular.element(event.target).addClass("being-dragged");
    elemBeingDragged = angular.element(event.target)
    divBeingDragged = elemBeingDragged.parent().parent();
  };
  $scope.stopCallback = function(event, ui) {
    angular.element(event.target).removeClass("being-dragged");
  };

  $scope.overCallback = function(event, ui) {
    //Checking if the list is new or old one.
    if (!$(divBeingDragged).is(event.target))
      angular.element(event.target).addClass("being-dropped")
  };

  $scope.outCallback = function(event, ui) {
    angular.element(event.target).removeClass("being-dropped")
  };

  socket.on('sprint:storyMoved', function(data) {
    //Going through all lists
    $scope.sprint.list.forEach(function(listItem) {

      //If the list is Old list , removing story
      if (listItem._id == data.oldListId){
        listItem.stories.splice($.inArray(data.storyId, listItem.stories), 1);
      }

      //If the list is new list, adding story
      if (listItem._id == data.newListId)
        listItem.stories.push(data.story)

    });

  });

}]);
