// fragileApp.run(function(editableOptions,editableThemes) {  editableOptions.theme = 'bs3';

// editableThemes['bs3'].submitTpl='<button class="btn btn-danger"  type="submit" ng-click="updateTodoItem(listItem,todo)">Save</button><button class="btn btn-danger btn-circle" ng-click="addMemberToChecklist(listItem)">...</button>';
// // bootstrap3 theme. Can be also 'bs2', 'default'
// });

fragileApp.controller('storyController', ['$scope', '$rootScope', '$stateParams', 'storyService', 'modalService', 'sprintService', 'releaseService', '$uibModal', '$uibModalInstance', '$location', 'Socket', 'Upload', 'param', '$window', function($scope, $rootScope, $stateParams, storyService, modalService, sprintService, releaseService, $uibModal, $uibModalInstance, $location, Socket, Upload, param, $window) {
  var socket = Socket($scope);
var localData={};
  var storyContr = this;
  /***param is the value resolved from uibModal which contains both story and sprint data***/
  storyContr.complexDataObject = param;
  storyContr.storyData = storyContr.complexDataObject.story.data;//getting story data
       // console.log("Point one: "+param);

  angular.forEach(storyContr.storyData.attachmentList, function(value, key) {
    storyContr.storyData.attachmentList[key].timeStamp = moment(value.timeStamp).fromNow();

  });



  storyContr.storyGrp = storyContr.complexDataObject.storyGrp;

  //Ends


  $scope.storyData = storyContr.storyData;
  $scope.storyComment = "";



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


  /***
  author:sharan
  function:addMember
  parameters:none
  description:This function is used to add members modal
  ***/
  //TODO:check how to make the member list dynamic: memaning check if u want to add a listener
  $scope.addMember = function() {
    modalService.open('sm', 'components/story/operations/addMember.view.html', 'storyOperationsController', storyContr.complexDataObject);
    console.log("complexDataObject --->",storyContr.complexDataObject);
  };

  //for toggling the selection of member while creating new task
  $scope.toggleMember=function(newMember,task){
    var result=0;
    var index=0;
    var hold=0;
    task.assignedMember.filter(function(obj)
      {
          if(obj._id==newMember._id)
          {
              result=1;
              hold=index;
          }
            index++;
      });
    if(result==1)
    {
      task.assignedMember.splice(hold,1);
    }
    else
    {
      task.assignedMember.push(newMember);
    }

    }
  //for toggling the selection of member while creating new task Ends

var flag=0;
localData=[];
$scope.memberArray=[];
$scope.memberArrayIndex=[];
  /***
  author:nitish
  function:addMember to check list
  parameters:none
  description:This function is used to add members to checklist
  ***/

//while loading the story page,setting memberArray with itemids and assignedMember
$scope.fetchMemberDetails=function()
{
  $scope.memberArray=[];
  $scope.memberArrayIndex=[];
$scope.storyData.checklist.filter(function(checkList)
{
  checkList.items.filter(function(item)
{
  obj={};
  obj["itemId"]=item._id;
  obj["arrayOfMembers"]=item.assignedMember;
  $scope.memberArrayIndex.push(item._id);
  $scope.memberArray.push(obj);
});
});
console.log("memberarray after item added",$scope.memberArray);
console.log("memberarrayindex after item added",$scope.memberArrayIndex);
}

console.log("newly created array",JSON.stringify($scope.memberArray));

  // $scope.addMemberObj=function(itemId)
  // {
  //   var check=$scope.memberArray.filter(function(obj)
  //   {
  //     return itemId==obj.itemId;
  //   });
  //   if(check.length==0)
  //   {
  //
  //   obj={};
  //   obj["itemId"]=itemId;
  //   obj["arrayOfMembers"]=[];
  //   $scope.memberArray.push(obj);
  //   console.log("memberArray ",$scope.memberArray);
  //
  //   }
  //
  // }

  $scope.addMemberToChecklist = function(listItem) {
    //socket.emit("join:room",{"room":"checklist:"+lis})
    console.log(listItem,"in add mem: ",listItem.assignedMember);


    listItem.assignedMember=$scope.memberArray[$scope.memberArrayIndex.indexOf(listItem._id)]["arrayOfMembers"];

    console.log("assignedMember list: ",listItem.assignedMember);
    var checkListId;
$scope.storyData.checklist.filter(function(checkList)
{
checkList.items.filter(function(item)
{
if(item._id==listItem._id)
    checkListId=checkList._id;
});
});
console.log("checklist id --->",checkListId);
console.log("memberList --->",$scope.storyData.memberList);
    data = {

      listItem:listItem,
     //members: storyData.assignedMember
       roomName:$scope.roomName,
      members:$scope.storyData.memberList,
      storyId:$scope.storyData._id,
      checkListId:checkListId,
      memberArray:$scope.memberArray
    };

modalService.open('sm', 'components/story/operations/addMemberToChecklist.view.html', 'addMemberToChecklistController', data);

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
    var assignedMember=[];
    //console.log("inside story controller"+$rootScope.itemMember.fullName);
    //assignedMember.push($rootScope.itemMember);
    var itemObj = {
      text: todo.todoText,
      checked: false,
      creationDate: Date.now(),
      dueDate:todo.dueDate,
      assignedMember:todo.assignedMember
    };



    socket.emit('story:addChecklistItem', {

      'room': $scope.roomName,
      'storyid': $scope.storyData._id,
      'checklistGrpId': todo._id,
      'itemObj': itemObj,
      'projectID': $scope.projectID,
      'text': todo.todoText,
      'user':$rootScope.userProfile
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
    console.log("inside the remove method--->");
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
   //to update list item
  $scope.updateListItem=function(listItem,checklistGrp){
  console.log("Modified item: ",listItem);
  // $scope.updateTodoItem(listItem,checklistGrp);

  }

$scope.operation='';
  $scope.updateTodoItem = function(listItem, checkListId,operation) {

    //todo.items.push({"text":todo.todoText,"done":false})

console.log("in controller",listItem,"operation: ",operation);
    socket.emit('story:updateChecklistItem', {
       'room': $scope.roomName,
       'storyid': $scope.storyData._id,
       'checklistGrpId': checkListId,
      'itemid': listItem._id,
      'checked': listItem.checked,
      'text': listItem.text,
      'operation':operation,
      'dueDate':listItem.dueDate,
      'projectID': $scope.projectID,
      'user':$rootScope.userProfile
    });
  };

        $scope.mydueDate = moment();//for datepicker
        var aFunction = function(){
             var newDate = moment(timestamp);
             $scope.mydueDate = newDate;
        }
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
  $scope.removeChecklistGroup = function(checklist, heading) {
    //TODO:Add listner
    var checkedCount=0;
    checklist.items.filter(function(item)
  {
    if(item.checked)
      checkedCount++;
  });
    socket.emit('story:removeChecklistGroup', {
      'room': $scope.roomName,
      'storyid': $scope.storyData._id,
      'checklistGrpId': checklist._id,
      'projectID': $scope.projectID,
      'heading': heading,
      'user':$rootScope.userProfile,
      'checkedCount':checkedCount,
      'itemsLength':checklist.items.length
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
      if(data._id==$scope.storyData._id)
      socket.emit("story:findStory",{"storyId":$scope.storyData._id,"roomName":$scope.roomName});


      console.log("im here to modify");
        // this is to set memberArray after item added/deleted.
      ///

    })


  socket.on("story:getStory",function(story)
    {
      if(story._id==$scope.storyData._id)
      {
        story.memberList.forEach(function(storyItem) {
          storyItem.fullName = storyItem.firstName + " " + storyItem.lastName;
        })
        $scope.storyData = story;
          $scope.fetchMemberDetails();
    }
  });

}])

// .component('task',
// {
//   bindings:
//   {
//     taskobj:'<',
//     onSave:'&'
//   },
//   controller:itemController,
//   templateUrl:"components/story/task.html"
// })
// .component('checklist',{
//   bindings:{
//     checklist:'<'
//   },
//   controller:checkListController,
//   templateUrl:"components/story/checkList.html"
// })
// .component('checklistgroup',{
//   bindings:{
//     checklistgroup:'<',
//     storyid:'<'
//   },
//   controller:checkListGroupController,
//   templateUrl:"components/story/checkListGroup.html"
// })
// function itemController($scope,Socket)
// {

// var socket=Socket($scope);
// var ctrl=this;

// ctrl.onSave=function(itemObject)
// {
//   socket.emit("story:editItem",itemObject);
// }

// ctrl.addViewMembers=function(itemId)
// {

// }

// ctrl.taskComplete=function(itemObject)
// {

// }

// };
// function checkListController()
// {

// }
// function checkListGroupController()
// {

// }
