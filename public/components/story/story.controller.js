fragileApp.controller('storyController',['$scope','$rootScope','$stateParams','storyService','modalService','sprintService','releaseService','$uibModal','$uibModalInstance','$location','Socket','param','$window',function($scope,$rootScope,$stateParams,storyService,modalService,sprintService,releaseService,$uibModal,$uibModalInstance,$location,Socket,param,$window){
var socket = Socket($scope);

  var storyContr = this;
  /***param is the value resolved from uibModal which contains both story and sprint data***/
  storyContr.complexDataObject = param;
  storyContr.storyData=storyContr.complexDataObject.story.data;
  angular.forEach(storyContr.storyData.attachmentList, function(value, key) {
        storyContr.storyData.attachmentList[key].timeStamp=moment(value.timeStamp).fromNow();
  });

  storyContr.storyGrp=storyContr.complexDataObject.storyGrp;

  $scope.storyData = storyContr.storyData;
  $scope.storyComment="";

  $scope.storyData.updatetime = moment($scope.storyData.lastUpdated).fromNow();

  //TODO:Check if these are required????
  var dataLoc = $location.search();
  var BoardID = dataLoc.BoardID;
  var storyID = dataLoc.storyId;

  $scope.storyID = storyContr.storyData._id; //Used in loading activity for card.
  $scope.sprintID =storyContr.complexDataObject.sprint._id;

  $scope.roomName = "sprint:" + $scope.sprintID;
  // var emitData = {
  //   'room': $scope.roomName
  // }
  // socket.emit('join:room', emitData);

  $scope.model = {
    description: {
      name: $scope.storyData.description
    },
    selected: {}
  };
  // gets the template to ng-include for a table row / item
  $scope.getTemplate = function () {
    if ($scope.set) return 'edit';
    else{
      $scope.set=false;
      return 'display';
    }
  };
  $scope.editDescription = function (descriptions) {
    $scope.set=true;
    $scope.model.selected = angular.copy(descriptions);
  };

  $scope.reset = function () {
    $scope.model.selected = $scope.model.description;
    $scope.set=false;
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
    modalService.open('sm', 'components/story/operations/addMember.view.html','storyOperationsController',storyContr.complexDataObject);
  };

  /***
  author:Sharan
  Function Name: addLabel
  Function Description: This method is called by Story modal to open sub-Modal of labels.
  This method calls ModalService factory method which creates the sub-Modal.
  Parametes: Modal-size,Template,Controller,Story&Sprint data.
  ***/
  $scope.addLabel = function() {
    modalService.open('sm', 'components/story/operations/addLabel.view.html','storyOperationsController',storyContr.complexDataObject);
  };

  /***
  author:srinivas
  function:removeLabel
  parameters:LabelObj
  description:This function is used to remove a label from the story.
  ***/
  $scope.removeLabel = function(LabelObj){

  }

  /***
  author:sharan
  function:removemember
  parameters:memberid
  description:function to remove member from story
  ***/
  $scope.removeMember=function(memberId){
    //working,tested
    socket.emit('story:removeMembers', {

      'room': $scope.roomName,
      'storyid': storyContr.storyData._id,
      'memberid': memberId
    });
  }

  socket.on('story:attachmentAdded', function(data){
    console.log(data._id);
    console.log($scope.storyData._id);
    if(data._id == $scope.storyData._id){
      // data.attachmentList.timeStamp = moment()
      $scope.storyData.attachmentList = data.attachmentList;

      angular.forEach($scope.storyData.attachmentList, function(value, key) {
            $scope.storyData.attachmentList[key].timeStamp=moment(value.timeStamp).fromNow();
      });

      console.log('On socket: ', $scope.storyData.attachmentList);
    }

  });

  socket.on('story:attachmentRemoved', function(data){
    console.log(data._id);
    console.log($scope.storyData._id);
    if(data._id == $scope.storyData._id){
      // data.attachmentList.timeStamp = moment()
      $scope.storyData.attachmentList = data.attachmentList;

      angular.forEach($scope.storyData.attachmentList, function(value, key) {
            $scope.storyData.attachmentList[key].timeStamp=moment(value.timeStamp).fromNow();
      });

      console.log('On socket: ', $scope.storyData.attachmentList);
    }

  })

  $scope.addAttachment = function() {
    modalService.open('sm', 'components/story/operations/addAttachment.view.html','MyCtrl',$scope.storyData);
    //$uibModalInstance.close($scope.searchTerm);
  };
  $scope.removeAttachment = function(storyId,attachmentId,file_name,name) {
    storyService.removeAttachment(storyId,attachmentId,file_name).success(function(data){

      data.room = $scope.roomName;
      data.projectID = $scope.projectID;
      data.type = name;

      socket.emit("story:removeAttachment", data);

    });
  };

  /***
  author:Sharan
  Function Name: addChecklist
  Function Description: This method is called by Story modal to open sub-Modal of checklists.
  This method calls ModalService factory method which creates the sub-Modal.
  Parametes: Modal-size,Template,Controller,Story data.
  ***/
  $scope.addChecklist = function() {
    modalService.open('sm', 'components/story/operations/addChecklistGroup.view.html','storyOperationsController',storyContr.complexDataObject);
  };

  /***
  author:Sharan,Srinivas
  Function Name: moveStory
  Function Description: This method is called by Story modal to open sub-Modal for story movement between sprints of the project.
  Parametes: Modal-size,Template,Controller,Story\Project data.
  ***/
  $scope.moveCopyStory = function(modalTemplate) {
    storyContr.complexDataObject.storyMoveData={};
    storyService.getStoryCopyMovementData($stateParams.prId).then(function(response) {

      //Required to showcase the current position of story in move\copy modal
      for(var rel=0;rel< response.data.release.length;rel++){
        if(response.data.release[rel]._id == $stateParams.releaseID){
          //TODO:this loop can be resused to give the non admin the rights to move/copy the story between lists of the same sprint.
          response.data.release.selectedRelease=response.data.release[rel];
          response.data.release.selectedSprints=storyContr.complexDataObject.sprint;
          //Below for loop is required because duplicates were displayed in list dropdown if display directly
          for (var sprIndex = 0; sprIndex < response.data.release.selectedSprints.list.length; sprIndex++) {
            if (response.data.release.selectedSprints.list[sprIndex]._id == storyContr.complexDataObject.currentPosition.listId) {
              console.log("enter");
              response.data.release.selectedList=response.data.release.selectedSprints.list[sprIndex];
               storyContr.complexDataObject.currentPosition.sprintId=response.data.release.selectedSprints._id;
              break;
            }
          }
          break;
        }

      }
      storyContr.complexDataObject.storyMoveData=response;
      modalService.open('sm', modalTemplate,'storyOperationsController',storyContr.complexDataObject);
    });;

  };
  $scope.deleteStory = function() {
  //Can use tool tip
    if ($window.confirm("Do you want to delete story?")){
      $uibModalInstance.dismiss('cancel');

      var deleteFrom='List';
      if(storyContr.complexDataObject.currentPosition.listItemName != 'Backlog'|| storyContr.complexDataObject.currentPosition.listItemName != 'Buglist'){
        deleteFrom=storyContr.complexDataObject.currentPosition.listItemName;
      }
            socket.emit('sprint:deleteStory', {
              'room': $scope.roomName,
              'storyId':$scope.storyData._id,
              'projectId':$stateParams.prId,
              'deleteFrom':deleteFrom,
              'sprintId': $scope.sprintID,
              'Listid':storyContr.complexDataObject.currentPosition.listId,
              'storyName':$scope.storyData.heading
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
  $scope.saveDescription=function(){
    $scope.model.description = angular.copy($scope.model.selected);
    //Post socket below is not required
    storyService.saveStoryDescription($scope.storyData._id,$scope.model.description.name);

    $scope.reset();
    $scope.set=false;
    $scope.checklistGrp =$scope.storyData.checklist;

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
      creationDate:Date.now(),
    }

    socket.emit('story:addChecklistItem', {

      'room': $scope.roomName,
      'storyid': $scope.storyData._id,
      'checklistGrpId': todo._id,
      'itemObj':itemObj,
      'projectID' : $scope.projectID,
      'text' : todo.todoText
    });

    todo.todoText = '';

  };

/***
authors:sharan
function:removeTodoItem
parameters:todo item,checklistId//Check once
description:this fuction is used to add a new item to the checklist group.
***/
$scope.removeTodoItem = function(listItem,checklistGrp,text) {
  console.log(checklistGrp)
  console.log(listItem);
  //todo.items.push({"text":todo.todoText,"done":false})

  socket.emit('story:removeChecklistItem', {

    'room': $scope.roomName,
    'storyid': $scope.storyData._id,
    'checklistGrpId': checklistGrp._id,
    'itemid':listItem._id,
    'checked':listItem.checked,
    'projectID' : $scope.projectID,
    'text':text
  });

};

/***
authors:sharan
function:updateTodoItem
parameters:todo item,checklistId//Check once
description:this fuction is used to add a new item to the checklist group.
***/
//TODO:Not working because of nth level
$scope.updateTodoItem = function(listItem,checklistGrp) {

  //todo.items.push({"text":todo.todoText,"done":false})

  socket.emit('story:updateChecklistItem', {

    'room': $scope.roomName,
    'storyid': $scope.storyData._id,
    'checklistGrpId': checklistGrp._id,
    'itemid':listItem._id,
    'checked':listItem.checked,
    'text': listItem.text,
    'projectID' : $scope.projectID
  });
};

  $scope.remaining = function(list, todo) {

    //Todo need to update this function
    var count = todo.checked;
    //console.log("sharan:"+todo);
    angular.forEach(todo, function(list) {
      count += list.checked ? -1 : 1;
    });
    todo.checked= count;
  };

  /***
  authors:Sharan,Srinivas
  Function Name: removeChecklistGroup
  Function Description: This method is called by sub-Modal window of checklist.It creates a new checklist group in the particular story and pushes the delta value to server.
  Parameters:None
  TODO:Presently we are not hitting the server for updating the data and pushing to model directly. Need to update the logic
  ***/
  $scope.removeChecklistGroup = function(checklistGrpId,heading) {
//TODO:Add listner
  socket.emit('story:removeChecklistGroup', {

      'room': $scope.roomName,
      'storyid': $scope.storyData._id,
      'checklistGrpId': checklistGrpId,
      'projectID' : $scope.projectID,
      'heading' : heading
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
console.log($scope.storyData._id);
  socket.emit('story:addComment', {
      'room': $scope.roomName,
      'storyId': $scope.storyData._id,
      'text': $scope.storyComment
    });
    $scope.storyComment = "";
  };

  /***
  authors:Sharan,Srinivas
  Function Name: clearComment
  Function Description: This method is used to clear the comment story textarea.
  Parameters:None
  ***/
  $scope.clearComment=function(){
      $scope.storyComment = "";
  }
//Handler to update story for all story changes
  socket.on('story:dataModified', function(data) {
    if(data._id == $scope.storyData._id){ //If the updated card is same as current opened card
      $scope.storyData = data;
    }
  })

}]);
