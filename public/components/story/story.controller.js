fragileApp.run(function(editableOptions,editableThemes) {
  editableOptions.theme = 'bs3';
  editableThemes['bs3'].submitTpl='<button class="btn btn-danger"  type="submit" id="updateTodoItem(todo)">Save</button><button class="btn btn-danger btn-circle" ng-click="fetchMembersForChecklist()">...</button>';
  // bootstrap3 theme. Can be also 'bs2', 'default'
});

fragileApp.controller('storyController', ['$scope', '$rootScope', '$stateParams', 'storyService', 'modalService', 'sprintService', 'releaseService', '$uibModal', '$uibModalInstance', '$location', 'Socket', 'Upload', 'param', '$window', function($scope, $rootScope, $stateParams, storyService, modalService, sprintService, releaseService, $uibModal, $uibModalInstance, $location, Socket, Upload, param, $window) {
  var socket = Socket($scope);

  console.log(socket.room);
  console.log(socket);
  var storyContr = this;
  /***param is the value resolved from uibModal which contains both story and sprint data***/
  storyContr.complexDataObject = param;
  console.log("----------");
  console.log(param);
  console.log($stateParams);
  $scope.projectID=$stateParams.prId;
  console.log($scope.projectID);
  storyContr.storyData = storyContr.complexDataObject.story.data;
  angular.forEach(storyContr.storyData.attachmentList, function(value, key) {
    storyContr.storyData.attachmentList[key].timeStamp = moment(value.timeStamp).fromNow();
  });

  storyContr.storyGrp = storyContr.complexDataObject.storyGrp;
  //Below code is to get labels data from project starts
  // $scope.storyTempData = [];
  // var respObj = $rootScope.projects.filter(function(item) {
  //   return item._id === $stateParams.prId;
  // });
  // for (var i = 0; i < respObj[0].labelId.labelList.length; i++) {
  //   if (storyContr.storyData.labelList.indexOf(respObj[0].labelId.labelList[i]._id) != -1) {
  //     $scope.storyTempData.push(respObj[0].labelId.labelList[i]);
  //   }
  // }
  // storyContr.storyData.labelList = $scope.storyTempData; //Overriding the old valuse
  //Ends
  $scope.storyData = storyContr.storyData;
  $scope.storyComment = "";

  console.log($scope.storyData);


  $scope.storyData.memberList.forEach(function(data) {
    data.fullName = data.firstName + " " + data.lastName;
  });

  $scope.storyData.updatetime = moment($scope.storyData.lastUpdated).fromNow();

  //TODO:Check if these are required????
  var dataLoc = $location.search();
  var BoardID = dataLoc.BoardID;
  var storyID = dataLoc.storyId;

  $scope.storyID = storyContr.storyData._id; //Used in loading activity for card.
  $scope.sprintID = storyContr.complexDataObject.sprint._id;
  var emitData=  {
    'room': "sprint:" + $scope.sprintID,
    'activityRoom': "activity:"+storyContr.complexDataObject.projectId
  }

  // if (!$scope.activityRoom || $scope.activityRoom != ('activity:' + $stateParams.prId)) { //Join an activity room if not already     joined || Change room if navigated from other project.
  //   $rootScope.activityRoom = 'activity:' + $stateParams.prId;
  //   emitData["activityRoom"] = 'activity:' + $stateParams.prId;
  // }
  console.log(sprintService.currentRoom);
  if(!sprintService.currentRoom.room){
    console.log("joining room"+emitData);
    socket.emit('join:room', emitData);

  }
  $scope.roomName = "sprint:" + $scope.sprintID;


  $scope.model = {
    description: {
      name: $scope.storyData.description
    },
    selected: {}
  };
  // gets the template to ng-include for a table row / item
  $scope.getTemplate = function() {
    if ($scope.set) return 'edit';
    else {
      $scope.set = false;
      return 'display';
    }
  };
  $scope.editDescription = function(descriptions) {
    $scope.set = true;
    $scope.model.selected = angular.copy(descriptions);
  };

  $scope.reset = function() {
    $scope.model.selected = $scope.model.description;
    $scope.set = false;
  };

  //
  // $scope.getStory = function() {
  //   console.log("inside");
  //   $scope.description = "edited";
  //   storyService.getStoryDetails().then(function(storyDetails) {
  //
  //   });
  // };
  /***
  author:sharan
  function:addMember
  parameters:none
  description:This function is used to add members modal
  ***/
  //TODO:check how to make the member list dynamic: memaning check if u want to add a listener
  $scope.addMember = function() {
    modalService.open('sm', 'components/story/operations/addMember.view.html', 'storyOperationsController', storyContr.complexDataObject);
  };

  /***
  author:Sharan
  Function Name: addLabel
  Function Description: This method is called by Story modal to open sub-Modal of labels.
  This method calls ModalService factory method which creates the sub-Modal.
  Parametes: Modal-size,Template,Controller,Story&Sprint data.
  ***/
  $scope.addLabel = function() {
    modalService.open('sm', 'components/story/operations/addLabel.view.html', 'storyOperationsController', storyContr.complexDataObject);
  };

  /***
  author:srinivas
  function:removeLabel
  parameters:LabelObj
  description:This function is used to remove a label from the story.
  ***/
  $scope.removeLabel = function(LabelObj) {

  }

  /***
  author:sharan
  function:removemember
  parameters:memberid
  description:function to remove member from story
  ***/
  $scope.removeMember = function(memberId, fullName) {
    //working,tested
    socket.emit('story:removeMembers', {

      'room': $scope.roomName,
      'storyid': storyContr.storyData._id,
      'memberid': memberId,
      'fullName': fullName,
      'projectID': $scope.projectID,
      'user':$rootScope.userProfile
    });
  }

  socket.on('story:attachmentAdded', function(data) {
    console.log(data._id);
    console.log($scope.storyData._id);
    if (data._id == $scope.storyData._id) {
      // data.attachmentList.timeStamp = moment()
      $scope.storyData.attachmentList = data.attachmentList;

      angular.forEach($scope.storyData.attachmentList, function(value, key) {
        $scope.storyData.attachmentList[key].timeStamp = moment(value.timeStamp).fromNow();
      });

      console.log('On socket: ', $scope.storyData.attachmentList);
    }

  });

  socket.on('story:attachmentRemoved', function(data) {
    console.log(data._id);
    console.log($scope.storyData._id);
    if (data._id == $scope.storyData._id) {
      // data.attachmentList.timeStamp = moment()
      $scope.storyData.attachmentList = data.attachmentList;

      angular.forEach($scope.storyData.attachmentList, function(value, key) {
        $scope.storyData.attachmentList[key].timeStamp = moment(value.timeStamp).fromNow();
      });

      console.log('On socket: ', $scope.storyData.attachmentList);
    }

  })

  $scope.addAttachment = function() {
    modalService.open('sm', 'components/story/operations/addAttachment.view.html', 'MyCtrl', $scope.storyData);
    //$uibModalInstance.close($scope.searchTerm);
  };
  $scope.removeAttachment = function(storyId, attachmentId, file_name, name) {
    storyService.removeAttachment(storyId, attachmentId, file_name).success(function(data) {

      data.room = $scope.roomName;
      data.projectID = $scope.projectID;
      data.type = name;
      data.user = $rootScope.userProfile;

      socket.emit("story:removeAttachment", data);
    });
  };
  /***
  author:Shrinivas
  Function Name: submit
  Function Description: This method is called by sub-Modal window of attachment. It will call the upload function which will take $scope.file as parameter which has details like file name, file path, file size etc..
  Parameters:$scope.file
  ***/
  $scope.upload = function() {
    if ($scope.form.file.$valid && $scope.file) {
      Upload.upload({
        url: '/story/addattachments',
        data: {
          file: $scope.file,
          storyId: storyContr.storyData._id
        }
      }).then(function(resp) {
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        resp.data.room = $scope.roomName;
        resp.data.projectID = $scope.projectID;
        resp.data.type = resp.config.data.file.name;
        resp.data.user = $rootScope.userProfile

        socket.emit('story:addAttachment', resp.data);
        console.log(resp.data, ">>>dismiss");
      }, function(resp) {
        console.log('Error status: ' + resp.status);
      }, function(evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    }
  };

  /***
  author:Sharan
  Function Name: addChecklist
  Function Description: This method is called by Story modal to open sub-Modal of checklists.
  This method calls ModalService factory method which creates the sub-Modal.
  Parametes: Modal-size,Template,Controller,Story data.
  ***/
  $scope.addChecklist = function() {
    modalService.open('sm', 'components/story/operations/addChecklistGroup.view.html', 'storyOperationsController', storyContr.complexDataObject);
  };

  /***
  author:Sharan,Srinivas
  Function Name: moveStory
  Function Description: This method is called by Story modal to open sub-Modal for story movement between sprints of the project.
  Parametes: Modal-size,Template,Controller,Story\Project data.
  ***/
  $scope.moveCopyStory = function(modalTemplate) {
    storyContr.complexDataObject.storyMoveData = {};
    storyService.getStoryCopyMovementData($stateParams.prId).then(function(response) {

      //Required to showcase the current position of story in move\copy modal
      for (var rel = 0; rel < response.data.release.length; rel++) {
        if (response.data.release[rel]._id == $stateParams.releaseID) {
          //TODO:this loop can be resused to give the non admin the rights to move/copy the story between lists of the same sprint.
          response.data.release.selectedRelease = response.data.release[rel];
          response.data.release.selectedSprints = storyContr.complexDataObject.sprint;
          //Below for loop is required because duplicates were displayed in list dropdown if display directly
          for (var sprIndex = 0; sprIndex < response.data.release.selectedSprints.list.length; sprIndex++) {
            if (response.data.release.selectedSprints.list[sprIndex]._id == storyContr.complexDataObject.currentPosition.listId) {
              console.log("enter");
              response.data.release.selectedList = response.data.release.selectedSprints.list[sprIndex];
              storyContr.complexDataObject.currentPosition.sprintId = response.data.release.selectedSprints._id;
              break;
            }
          }
          break;
        }

      }
      storyContr.complexDataObject.storyMoveData = response;
      modalService.open('sm', modalTemplate, 'storyOperationsController', storyContr.complexDataObject);
    });;

  };
  $scope.deleteStory = function() {
    //Can use tool tip
    if ($window.confirm("Do you want to delete story?")) {
      $uibModalInstance.dismiss('cancel');

      var deleteFrom = 'List';
      if (storyContr.complexDataObject.currentPosition.listItemName != 'Backlog' || storyContr.complexDataObject.currentPosition.listItemName != 'Buglist') {
        deleteFrom = storyContr.complexDataObject.currentPosition.listItemName;
      }
      socket.emit('sprint:deleteStory', {
        'room': $scope.roomName,
        'storyId': $scope.storyData._id,
        'projectId': $stateParams.prId,
        'deleteFrom': deleteFrom,
        'sprintId': $scope.sprintID,
        'Listid': storyContr.complexDataObject.currentPosition.listId,
        'storyName': $scope.storyData.heading,
        'user':$rootScope.userProfile
      });



    }
  };



  //Not required at story level
  $scope.ok = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

  /****
  author:Srinivas
  function:saveDescription
  parameters:none
  description:this function is used to update the story description
  **/
  $scope.saveDescription = function() {
    $scope.model.description = angular.copy($scope.model.selected);
    //Post socket below is not required
    storyService.saveStoryDescription($scope.storyData._id, $scope.model.description.name);

    $scope.reset();
    $scope.set = false;
    $scope.checklistGrp = $scope.storyData.checklist;

  };
  //TODO Starts, push this to start of the file

  /***
  authors:sharan
  function:addTodoItem
  parameters:todo item,checklistId//Check once
  description:this fuction is used to add a new item to the checklist group.
  ***/
  $scope.addTodoItem = function(todo) {
    //todo.items.push({"text":todo.todoText,"done":false})
    var itemObj = {
      text: todo.todoText,
      checked: false,
      creationDate: Date.now(),
      dueDate:todo.todoDueDate
    }

    socket.emit('story:addChecklistItem', {

      'room': $scope.roomName,
      'storyid': $scope.storyData._id,
      'checklistGrpId': todo._id,
      'itemObj': itemObj,
      'projectID': $scope.projectID,
      'text': todo.todoText,
      'user':$rootScope.userProfile,
      'dueDate':todo.todoDueDate
    });

    todo.todoText = '';

  };

  /***
  authors:sharan
  function:removeTodoItem
  parameters:todo item,checklistId//Check once
  description:this fuction is used to add a new item to the checklist group.
  ***/
  $scope.removeTodoItem = function(listItem, checklistGrp, text) {
    console.log(checklistGrp)
    console.log(listItem);
    //todo.items.push({"text":todo.todoText,"done":false})

    socket.emit('story:removeChecklistItem', {

      'room': $scope.roomName,
      'storyid': $scope.storyData._id,
      'checklistGrpId': checklistGrp._id,
      'itemid': listItem._id,
      'checked': listItem.checked,
      'projectID': $scope.projectID,
      'text': text,
      'user':$rootScope.userProfile
    });

  };

  /***
  authors:sharan
  function:updateTodoItem
  parameters:todo item,checklistId//Check once
  description:this fuction is used to add a new item to the checklist group.
  ***/
  //TODO:Not working because of nth level
  $scope.updateTodoItem = function(listItem, checklistGrp) {

    //todo.items.push({"text":todo.todoText,"done":false})

    socket.emit('story:updateChecklistItem', {

      'room': $scope.roomName,
      'storyid': $scope.storyData._id,
      'checklistGrpId': checklistGrp._id,
      'itemid': listItem._id,
      'checked': listItem.checked,
      'text': listItem.text,
      'projectID': $scope.projectID,
      'user':$rootScope.userProfile
    });
  };

  $scope.remaining = function(list, todo) {

    //Todo need to update this function
    var count = todo.checked;
    //console.log("sharan:"+todo);
    angular.forEach(todo, function(list) {
      count += list.checked ? -1 : 1;
    });
    todo.checked = count;
  };

  /***
  authors:Sharan,Srinivas
  Function Name: removeChecklistGroup
  Function Description: This method is called by sub-Modal window of checklist.It creates a new checklist group in the particular story and pushes the delta value to server.
  Parameters:None
  TODO:Presently we are not hitting the server for updating the data and pushing to model directly. Need to update the logic
  ***/
  $scope.removeChecklistGroup = function(checklistGrpId, heading) {
    //TODO:Add listner
    socket.emit('story:removeChecklistGroup', {

      'room': $scope.roomName,
      'storyid': $scope.storyData._id,
      'checklistGrpId': checklistGrpId,
      'projectID': $scope.projectID,
      'heading': heading,
      'user':$rootScope.userProfile
    });
  };
  /***
  authors:Sharan,Srinivas
  Function Name: saveComment
  Function Description: This method is used to add new comments to the story.
  Parameters:None
  ***/
  $scope.saveComment = function() {
    //TODO:Add listner
    socket.emit('story:addComment', {
      'room': $scope.roomName,
      'storyId': $scope.storyData._id,
      'text': $scope.storyComment,
      'projectID': $scope.projectID,
      'user':$rootScope.userProfile
    });
    $scope.storyComment = "";
  };

  /***
  authors:Sharan,Srinivas
  Function Name: clearComment
  Function Description: This method is used to clear the comment story textarea.
  Parameters:None
  ***/
  $scope.clearComment = function() {
    $scope.storyComment = "";
  }
  //Handler to update story for all story changes
  socket.on('story:dataModified', function(data) {
    if (data._id == $scope.storyData._id) { //If the updated card is same as current opened card
      data.memberList.forEach(function(storyItem) {
        storyItem.fullName = storyItem.firstName + " " + storyItem.lastName;
      });
      ///
      // $scope.storyTempData = [];
      // var projObj = $rootScope.projects.filter(function(item) {
      //   return item._id === $stateParams.prId;
      // });
      // for (var i = 0; i < projObj[0].labelId.labelList.length; i++) {
      //   if (data.labelList.indexOf(projObj[0].labelId.labelList[i]._id) != -1) {
      //     $scope.storyTempData.push(projObj[0].labelId.labelList[i]);
      //   }
      // }
      // data.labelList = $scope.storyTempData; //Overriding the old valuse
      // ///
      $scope.storyData = data;
    }
  })

  // $scope.fetchMembersForChecklist=function(){
  // $scope.checkListMembers=$rootScope.membersData;
  // }



  $scope.fetchMembersForChecklist = function() {
    modalService.open('sm', 'components/story/operations/addMemberItem.view.html', 'storyOperationsController', storyContr.complexDataObject);
  };

}]);
