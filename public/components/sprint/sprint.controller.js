fragileApp.controller('sprintController', ['$scope', '$rootScope', '$stateParams', 'sprintService', '$state', 'Socket', '$uibModal', function($scope, $rootScope, $stateParams, sprintService, $state, Socket, $uibModal) {
  $scope.getSprints = function() {
    $scope.addToBacklog = false;
    $scope.addToBuglist = false;
    sprintService.getSprints($stateParams.sprintID).then(function(sprint) {
      $scope.sprint = sprint.data;
      $scope.sprintWidth = ($scope.sprint.list.length * 278 + 560) + "px";

    });
    sprintService.getBackBug($stateParams.prId).then(function(backBug) {
      $scope.backBug = backBug.data;
    });
    $scope.AddStoryDiv = "AddStoryDiv";

    sprintService.getProject($stateParams.sprintID).then(function(project){
      $rootScope.projectID = project.data[0]._id;
      $rootScope.projectName = project.data[0].name;
    })

    $rootScope.isMenu = false;
    $rootScope.SlideMenu = function() {
      $rootScope.isMenu = !$rootScope.isMenu;
    }

    $scope.storyDragged = false;
  };

  var socket = Socket($scope);

  $scope.roomName = "sprint:" + $stateParams.sprintID
  var emitData = {
    'room': $scope.roomName
  }
  if (!$scope.activityRoom || $scope.activityRoom != ('activity:' + $stateParams.prId)) { //Join an activity room if not already     joined || Change room if navigated from other project.
    $rootScope.activityRoom = 'activity:' + $stateParams.prId
    emitData["activityRoom"] = 'activity:' + $stateParams.prId
  }
  socket.emit('join:room', emitData);

  $rootScope.projectID = $stateParams.prId;


  socket.on('sprint:storyAdded', function(data) {
    var listName = ""
    if (data.listId == "BugLists") {
      $scope.backBug.buglist.stories.push(data);
      listName = "Bug List"
    } else if (data.listId == "Backlogs") {
      $scope.backBug.backlogs.stories.push(data);
      listName = "Backlogs"
    } else {
      angular.forEach($scope.sprint.list, function(value, key) {
        if (value._id == data.listId) {
          $scope.sprint.list[key].stories.push(data);
          listName = $scope.sprint.list[key].listName
        }
      });
    }
  });

    socket.on('sprint:storyDeleted', function(data) {
      console.log("------------------ inside storyDeleted");
      console.log(data);
      console.log("----------------------");
      if (data.deleteFrom == "Backlog") {
        $scope.backBug.backlogs.stories.forEach(function(story, storyIndex) {
          console.log("--------------Inside For Each");
          if (story._id == data.storyId) {
            console.log("---------------- Found to delete");
            $scope.backBug.backlogs.stories.splice(storyIndex, 1);
          }
        });
      }
      else if (data.deleteFrom == "Buglist") {
        $scope.backBug.buglist.stories.forEach(function(story, storyIndex) {
          console.log("--------------Inside For Each");
          if (story._id == data.storyId) {
            console.log("---------------- Found to delete");
            $scope.backBug.buglist.stories.splice(storyIndex, 1);
          }
        });
      }
      else {
        console.log("Inside Else");
        angular.forEach($scope.sprint.list, function(value, key) {
          if (value._id == data.Listid) {
            console.log("--------Found List");
            $scope.sprint.list[key].stories.forEach(function(story, storyIndex) {
              console.log("--------------Inside For Each");
              if (story._id == data.storyId) {
                console.log("---------------- Found to delete");
                $scope.sprint.list[key].stories.splice(storyIndex, 1);
              }
            });
          }
        });
      }
    });


  $scope.clickOnAdd = function(id) {
    console.log(angular.element('#'+id));
    angular.element('#'+id).focus();
  };
  $scope.show = function(listId, bool) {
    return listId + bool;
  };

  $scope.deleteStory = function(storyId, from, Listid, sprintId) {
    console.log("-----In controller Now emmiting");
    socket.emit('sprint:deleteStory', {
      'room': $scope.roomName,
      'activityRoom': 'activity:' + $stateParams.prId,
      'deleteFrom': from,
      'storyId':storyId,
      'projectId': $stateParams.prId,
      'Listid': Listid,
      'sprintId': sprintId
    });
  };

  $scope.addStory = function(listId, storyDetails, id, listName) {
    // $scope.listIdAdded = id;
    if (storyDetails != undefined && storyDetails != "") {
      var emitData = {
        'room': $scope.roomName,
        'activityRoom': 'activity:' + $stateParams.prId,
        'addTo': listId,
        'projectId': $stateParams.prId,
        'storyStatus': "",
        'sprintId': $stateParams.sprintID,
        'heading': storyDetails,
        'description': "",
        'listId': listId,
        'id': id,
        'listName': listName
      }
      socket.emit('sprint:addStory', emitData );
      $scope.storyDetails = "";
      return true;
    } else {
      return false
    }
  }

  $scope.gotoTop = function(id) {
    angular.element("#"+id)[0].scrollBottom=0;
  };

  var divBeingDragged = "",
    elemBeingDragged = "";

  $scope.dropCallback = function(event, ui) {
    //Called when story is dropped in list
    angular.element(event.target).removeClass("being-dropped")

    if (divBeingDragged[0].id != angular.element(event.target)[0].id) { //Checking if card is dropped into a new list
      var emitData = {
        'room': $scope.roomName,
        'activityRoom': 'activity:' + $stateParams.prId,
        'projectID': $stateParams.prId,
        'sprintId': $stateParams.sprintID,
        'oldListId': divBeingDragged[0].id,
        'newListId': angular.element(event.target)[0].id,
        'storyId': elemBeingDragged[0].id
      }
      if (divBeingDragged[0].id == "backlogs" || divBeingDragged[0].id == "buglists")
        socket.emit('sprint:moveFromBackbugStory', emitData)
      else
        socket.emit('sprint:moveStory', emitData)
    }

  };

  $scope.dropCallback_backbug = function(event, ui) {
    //Called when story is dropped in backlog/buglist
    angular.element(event.target).removeClass("being-dropped")
    if (divBeingDragged[0].id != angular.element(event.target)[0].id) { //Checking if card is dropped into a new list

      socket.emit('sprint:moveToBackbugStory', {
        'room': $scope.roomName,
        'activityRoom': 'activity:' + $stateParams.prId,
        'projectID': $stateParams.prId,
        'sprintId': $stateParams.sprintID,
        'oldListId': divBeingDragged[0].id,
        'newListId': angular.element(event.target)[0].id,
        'storyId': elemBeingDragged[0].id
      });
    }

  };
  $scope.startCallback = function(event, ui) {
    angular.element(event.target).addClass("being-dragged");
    elemBeingDragged = angular.element(event.target);
    divBeingDragged = elemBeingDragged.parent().parent();
  };
  $scope.stopCallback = function(event, ui) {
    angular.element(event.target).removeClass("being-dragged");
  };

  $scope.overCallback = function(event, ui) {
    //Checking if the list is new or old one.
    if (!$(divBeingDragged).is(event.target)) {
      angular.element(event.target).addClass("being-dropped")
    }
  };

  $scope.outCallback = function(event, ui) {
    angular.element(event.target).removeClass("being-dropped")
  };


  socket.on('sprint:storyMoved', function(data) {

    //Going through all lists
    $scope.sprint.list.forEach(function(listItem) {

      //If the list is Old list , removing story
      if (listItem._id == data.oldListId) {
        listItem.stories.forEach(function(storyData, index) {
          if (storyData._id == data.storyId)
            listItem.stories.splice(index, 1);
        });
      }

      //If the list is new list, adding story
      if (listItem._id == data.newListId) {
        listItem.stories.push(data.story)

      }

    });

  });

  socket.on('sprint:backbugStoryMovedTo', function(data) {
    if (data.newListId == "backlogs")
      $scope.backBug.backlogs.stories.push(data.story);
    else if (data.newListId == "buglists")
      $scope.backBug.buglist.stories.push(data.story);

    $scope.sprint.list.forEach(function(listItem) {

      //If the list is Old list , removing story
      if (listItem._id == data.oldListId) {
        listItem.stories.forEach(function(storyData, index) {
          if (storyData._id == data.storyId)
            listItem.stories.splice(index, 1);
        });
      }
    });

  });

  socket.on('sprint:backbugStoryMovedFrom', function(data) {
    if (data.oldListId == "backlogs") {
      $scope.backBug.backlogs.stories.forEach(function(storyData, index) {
        if (storyData._id == data.storyId)
          $scope.backBug.backlogs.stories.splice(index, 1);
      });
    } else if (data.oldListId == "buglists") {
      $scope.backBug.buglist.stories.forEach(function(storyData, index) {
        if (storyData._id == data.storyId)
          $scope.backBug.buglist.stories.splice(index, 1);
      });
    }

    $scope.sprint.list.forEach(function(listItem) {
      //If the list is new list, adding story
      if (listItem._id == data.newListId) {
        listItem.stories.push(data.story)
      }
    });


  });

  //To emit activity related to story move
  socket.on('sprint:storyActivity', function(data) {
    var listName = "",
      listId = "";
    if (data.newListId == "backlogs" || data.newListId == "buglists")
      listName = data.newListId.replace("b", "B");
    else {
      $scope.sprint.list.forEach(function(listItem) {
        if (listItem._id == data.newListId) {
          lisId = listItem._id;
          listName = listItem.listName;
        }
      });
    }


    var actData = {
      room: 'activity:' + $stateParams.prId,
      action: "moved",
      projectID: $stateParams.prId,
      object: {
        name: data.story.heading,
        type: "Story",
        _id: data.story._id
      },
      target: {
        name: listName,
        type: "List",
        _id: data.story._id
      }
    }
    socket.emit('addActivity', actData);
  });

  $scope.scrollText = "Go to Buglists";
  $scope.scrollClass = "fa fa-chevron-right";
  $scope.toggleScroll = function() {
    if ($scope.scrollText == "Go to Buglists") {
      $('#mainSprint').css('margin-left', "-" + parseInt($scope.sprintWidth)/2.95 + "px");
      // console.log('margin-left', "-" + parseInt($scope.sprintWidth)/2.95 + "px");
      $scope.scrollClass = "fa fa-chevron-left";
      $scope.scrollText = "Go to Backlogs";
    } else {
      $('#mainSprint').css('margin-left', '0');
      $scope.scrollClass = "fa fa-chevron-right";
      $scope.scrollText = "Go to Buglists";
    }

  }



  /***
  author:Sharan
  Function Name: showModal
  Function Description: This method is called by stories in Sprint Lists.
  This will create\opens a uib modal instance for the story
  Parameters:storyId
  resolve:Sprint, Story,ProjectMembers
  TODO:Presently we are not hitting the server for updating the data and pushing to model directly. Need to update the logic
  ***/
  $scope.showModal = function(storyID,storyGrp,listItemId,listItemName)
  {
    var currentPosition = {}
    currentPosition.listId=listItemId;
    currentPosition.listItemName = listItemName;
    sprintService.getStory(storyID).then(function(story) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/components/story/story.view.html',
        controller: 'storyController',
        controllerAs: 'storyContr',
        size: 'lg',
        resolve: {
          param: function() {
            return {
              story:story,
              sprint:$scope.sprint,
              projMembers:$rootScope.memberList,//TODO:Check if this can be sent directly instead of resolve
              storyGrp:storyGrp,
              currentPosition:currentPosition
            };
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        socket.emit('join:room', {'room': $scope.roomName}); // To join back the room
      });


    });
  }
}]);
