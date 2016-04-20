fragileApp.controller('storyOperationsController',['$scope','$rootScope','$stateParams','storyService','modalService','$uibModal','$uibModalInstance','$location','param','Socket',function($scope,$rootScope,$stateParams,storyService,modalService,$uibModal,$uibModalInstance,$location,param,Socket){
var socket = Socket($scope);
  //TODO:need to check whether we need to get the "$scope.memberDetails" data directly from rootscope without resolving it in story Modal.   ---->Check


  //TODO:Need to redefine this common controller based on which template getting loaded because we can define scope parameters based on that and reduce unwanted data. ----->Almost done check again
  //This can be done using init function specific to each action

  //TODO:Add dismisal for all sub modal --->Added cancel, call it from modals


  /***Received the data from resolve functionality of uibModal***/
  $scope.storyDetails= param.story.data;
  $scope.roomName = "story:" + $scope.storyDetails._id;

  /***
  author:Sharan
  function:initLoadMembers
  parameters:none
  description:This function is used to create\load the required model for members
  ***/
  $scope.initLoadMembers = function(){
    $scope.memberDetails= param.projMembers;
    /*** Declaring variables required for addMembers,addLabels***/
    $scope.longDescLimit=25 ;
    $scope.checked = true;

  }

  /***
  author:Sharan
  function:initLabels
  parameters:none
  description:This function is used to create\load the required model for members
  ***/
  $scope.initLabels = function(){
    $scope.sprintDetails= param.sprint; //required in labels
    $scope.labelTemplate={};
    /*** Declaring variables required for addMembers,addLabels***/
    $scope.longDescLimit=25 ;
    $scope.checked = true;
  }

  /***
  author:sharan
  function:initCopyMoveStory
  parameters:isMove boolean value to identify copy and move modal
  description:This function is a init function called by Move and Copy Story modal.
  ***/
  $scope.initCopyMoveStory=function(isMove){
    if(isMove){
      $scope.moveCopyButtonDisabled=true;
    }else{
      $scope.moveCopyButtonDisabled=false;
    }
    $scope.storyMoveData=param.storyMoveData.data;
    $scope.storyCurrentPosition=param.currentPosition;
    $scope.moveTo={};
    $scope.moveTo.listType=[{name:'Backlog',Id:1},{name:'Buglist',Id:2},{name:'Other',Id:3}]  ;
    $scope.moveTo.selectedOption={};
    switch ($scope.storyCurrentPosition.listItemName) {
      case "Backlog": $scope.moveTo.selectedOption={name:'Backlog',Id:1};
      $scope.moveTo.checkDisabled=true;
      break;
      case "Buglist": $scope.moveTo.selectedOption={name:'Buglist',Id:2};
      $scope.moveTo.checkDisabled=true;
      break;
      default: $scope.moveTo.selectedOption={name:'Other',Id:3};
      $scope.moveTo.checkDisabled=false;
      break;
    }
  }

  /***
  author:Sharan
  function:cancel
  parameter:none
  description:Used to dismiss submodal windows
  ***/
  $scope.cancel=function(){
    //Use it for dismisal of modal
    $uibModalInstance.dismiss('cancel');
  }


  /***
  author:Sharan
  function:moveStory
  parameters:none
  description:This function is used to move the story from current position to new position.
  TODO:Checking if there was no change in the position
  ***/
  $scope.moveStory=function(){

    if($scope.moveTo.selectedOption.name != "Other"){
      //trigger websocket to move to backlog
    }
    else{
      //trigger websocket :story to move to new list

      //$scope.storyMoveData.release.selectedRelease._id
      //$scope.storyMoveData.release.selectedSprints._id
      //$scope.storyMoveData.release.selectedList._id

    }
  }

  /***
  author:Sharan
  function:copyStory
  parameters:none
  description:This function is used to create dupilcate of the current story to spcified destination
  ***/
  $scope.copyStory=function(){

    if($scope.moveTo.selectedOption.name != "Other"){
      //trigger websocket to move to backlog
    }
    else{
      //TODO:below lines
      //trigger websocket :story to move to new list
      //Feilds required to be passed
      //$scope.storyMoveData.release.selectedRelease._id
      //$scope.storyMoveData.release.selectedSprints._id
      //$scope.storyMoveData.release.selectedList._id
      //Story Heading,Story Description

    }
  }

  /***
  author:Sharan
  function:copySelectionChange
  parameters:none
  description:This function is triggered in move story sub modal to disable\enable the move button based on selection
  ***/
  $scope.copySelectionChange=function(){
    /**Checks for backlog Buglist**/
    if($scope.moveTo.selectedOption.name != "Other"){
      if(!$scope.moveTo.selectedOption.name){
        $scope.moveCopyButtonDisabled=false;
      }else{
        $scope.moveCopyButtonDisabled=true;
      }
    }
    else{
      /**This condition cheks if there was change in other selection and enable move**/
      if ( !$scope.storyMoveData.release.selectedList || !$scope.storyMoveData.release.selectedList.listName) {
        $scope.moveCopyButtonDisabled=true;
      }else{
        $scope.moveCopyButtonDisabled=false;
      }
    }
  }
  /***
  author:Sharan
  function:moveSelectionChange
  parameters:none
  description:This function is triggered in move story sub modal to disable\enable the move button based on selection
  ***/
  $scope.moveSelectionChange=function(){
    /**Checks for backlog Buglist**/
    if($scope.moveTo.selectedOption.name != "Other"){
      if($scope.moveTo.selectedOption.name != $scope.storyCurrentPosition.listItemName){
        $scope.moveCopyButtonDisabled=false;
      }else{
        $scope.moveCopyButtonDisabled=true;
      }
    }
    else{
      /**This condition cheks if there was change in other selection and enable move**/
      if ( !$scope.storyMoveData.release.selectedList || !$scope.storyMoveData.release.selectedList.listName || $scope.storyCurrentPosition.listItemName == $scope.storyMoveData.release.selectedList.listName) {
        $scope.moveCopyButtonDisabled=true;
      }else{
        $scope.moveCopyButtonDisabled=false;
      }
    }
  }

  /***
  author:Sharan
  function:moveSelectionChange
  parameters:none
  description:This function is triggered in move story sub modal to disable\enable the release\sprint\list selection box and move button based on selection
  ***/

  $scope.moveCopyDestinationChange= function(){
    if ($scope.moveTo.selectedOption.name != "Other") {
      $scope.moveTo.checkDisabled=true;
    }else{
      $scope.moveTo.checkDisabled=false;
    }
  }
  /***
  authors:Sharan,Srinivas
  Function Name: addChecklistGroup
  Function Description: This method is called by sub-Modal window of checklist.It creates a new checklist group in the particular story and pushes the delta value to server.
  Parameters:None
  TODO:Presently we are not hitting the server for updating the data and pushing to model directly. Need to update the logic
  ***/
  $scope.addChecklistGroup = function() {

    //Use this for on listener
    var checklistGrp={
      checklistHeading:$scope.todoGroupText ,
      checkedCount:0,
      items:[]
    };

    //TODO:Call web sockets to add the checklist group and pass only heading and checkedCount:0

    socket.emit('story:addChecklistGroup', {

      'room': $scope.roomName,
      'storyid': $scope.storyDetails._id,
      'checklistGrp': checklistGrp
    });


    $scope.todoText = '';
    $uibModalInstance.dismiss('cancel');
  };

  /***
  authors:Sharan
  function:createLabel
  description:This function is used to create a new label in to the label list of sprint Collection.This function is reused to set the selected label data to the model
  parameters:labelsData,isCreate(boolean)
  ***/
  //TODO:Need to be tested by adding few label data into the sprint
  $scope.createLabel=function(isCreate,labelData){
    if(isCreate){
      //TODO:call create template websocket passing $scope.labelTemplate
    }else {
      $scope.labelTemplate.colorName=labelData.colorName;
      $scope.labelTemplate.colorCode=labelData.colorCode;
    }
  }

  /***
  authors:Sharan
  function:updateLabel
  parameters:none
  description:This function is used to edit a label in addlabel sub modal and saved under sprint level.
  ***/
  //TODO:Need to be tested by adding few label data into the sprint
  $scope.updateLabel=function(){

  }

  /***
  authors:Sharan,srinivas
  function:addRemoveLabel
  parameters:labelObj
  description:This function is used to add a new label to the story;
  ***/
  //TODO:analyse whether we need to add the label or remove the label by comparing it with story label list array and change the tick mark in sub modal accordingly
  $scope.addRemoveLabel=function(labelObj){
    //pass labelobj._id to backend to add to the story,storyDetails using websocket
    var operation;
    var labelObj = $scope.storyDetails.labelList.filter(function ( obj ) {
      return obj._id === labelObj._id;
    })[0];

    socket.emit('story:addRemoveLabel', {

      'room': $scope.roomName,
      'storyid': $scope.storyDetails._id,
      'labelid':labelObj._id,
      'operation':operation
    });




  }

  /***
  authors:sharan,srinivas
  fuction:toggleLabel
  parameters:none
  description:This function is used to change the view of labels sub modal to display edit\addlabel and create a new label using the template.
  ***/
  $scope.toggleLabel=function(){
    $scope.checked=!$scope.checked;
  }

  /***
  authors:sharan,srinivas
  function:addRemoveMembers
  parameters:memberObj
  description:This function is used to add or remove users from the story.
  ***/
  //TODO:Handle the tick marks on the selected members
  $scope.addRemoveMembers=function(memberObj){
    //compare the memberObj with the memberlist in the story collection and check process accordingly.
    console.log($scope.storyDetails);
    //TODO:checking if the member is already in the story.once the user is removed, it has to send add members request but it is not because initial story member list is brought using resolve. when parent gets updated then child is not . So add one more lisner in sub modal to update the list available with submodal
    var userObj = $scope.storyDetails.memberList.filter(function ( obj ) {
      return obj._id === memberObj._id;
    })[0];
    if (userObj == undefined) {
      //Add members working,tested
      socket.emit('story:addMembers', {

        'room': $scope.roomName,
        'storyid': $scope.storyDetails._id,
        'memberid': memberObj._id
      });
    }else{
      //remove members working, tested
      socket.emit('story:removeMembers', {

        'room': $scope.roomName,
        'storyid': $scope.storyDetails._id,
        'memberid': memberObj._id
      });
    }
  }
}]);
fragileApp.controller('MyCtrl', ['$scope','param', 'Upload','$uibModalInstance', function ($scope,param, Upload,$uibModalInstance) {

  /***
  author:Shrinivas
  Function Name: submit
  Function Description: This method is called by sub-Modal window of attachment. It will call the upload function which will take $scope.file as parameter which has details like file name, file path, file size etc..
  Parameters:$scope.file
  ***/
  $scope.submit = function() {
    if ($scope.form.file.$valid && $scope.file) {
      $scope.upload($scope.file);
    }
  };
  /***
  author:Shrinivas
  Function Name: upload
  Function Description: This method is called by sub-Modal window of attachment. It will upload the file from client side and put the file in server side in uploadfile folder.
  Parameters:file
  ***/
  $scope.upload = function (file) {
    Upload.upload({
      url: '/story/addattachments',
      data: {file: file,storyId:param._id}
    }).then(function (resp) {
      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
    $uibModalInstance.dismiss('cancel');
  };
  /***
  author:Shrinivas
  Function Name: close
  Function Description: This method is called by sub-Modal window of close the window.
  ***/
  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

}]);
