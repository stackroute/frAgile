fragileApp.controller('storyController',['$scope','$rootScope','$stateParams','storyService','modalService','sprintService','$uibModal','$uibModalInstance','$location','Socket','param',function($scope,$rootScope,$stateParams,storyService,modalService,sprintService,$uibModal,$uibModalInstance,$location,Socket,param){

  var socket = Socket($scope);

  // var story = this;
  // story.items =sprintService.storyData;
  console.log(param);
  var storyContr = this;
  /***param is the value resolved from uibModal which contains both story and sprint data***/
  storyContr.complexDataObject = param;
  storyContr.storyData=storyContr.complexDataObject.story.data;
  storyContr.storyGrp=storyContr.complexDataObject.storyGrp;
  storyContr.storyData.updatetime = moment(storyContr.storyData.lastUpdated).fromNow();
  console.log("storyData");
  console.log(storyContr.storyData);
  var dataLoc = $location.search();
  var BoardID = dataLoc.BoardID;
  var storyID = dataLoc.storyId;


//This code need to be moved to board code to create the room w.r.t to boardid.
  console.log("Joining the story room");
  socket.emit('join:room', {
				'room': storyContr.storyData._id
			});
//Ends

  $scope.model = {
    description: {
      name: storyContr.storyData.description
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
  // $scope.saveDescription = function () {
  //   $scope.model.description = angular.copy($scope.model.selected);
  //   $scope.reset();
  //   $scope.set=false;
  // };
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


  $scope.addAttachment = function() {
    modalService.open('sm', 'addAttachment.html');
    //$uibModalInstance.close($scope.searchTerm);
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

  $scope.moveStory = function() {
    modalService.open('sm', 'moveStory.html');
  };
  $scope.copyStory = function() {
    modalService.open('sm', 'copyStory.html');
  };
  $scope.deleteStory = function() {
    modalService.open('sm', 'deleteStory.html');
  };
  $scope.ok = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cancel = function() {
    // console.log("cancel is working" +JSON.stringify($uibModal));
    $uibModalInstance.dismiss('cancel');
  };
  $scope.saveDescription=function(){
    console.log("save Description in contoller");
    //  $scope.description=$scope.newdescription;
    $scope.model.description = angular.copy($scope.model.selected);
    storyService.saveStoryDescription(storyContr.storyData._id,$scope.model.description.name);

    $scope.reset();//Not required I guess
    $scope.set=false;

    ///Socket Coding starts
    console.log("about to emit in client");
    story.emit('send:message', {
      'room': storyContr.storyData._id,
      'message':$scope.model.description.name
    });

    story.on('room:message', function(data) {
  				console.log('recieved messagef rom ', data.room, ' message: ', data.message);
  			//	$scope.pubMessages.push(data.message);
        console.log("this is the message received:   "+data.message);
  				$scope.now = new Date();
  		//		$scope.$apply();
  			});

    //Socket coding ends
  };
  //TODO Starts
  $scope.todos =storyContr.storyData.checklist;
  console.log("DATA printed: "+$scope.todos);
  // [{
  // heading:"Group 1",
  // checked:1,
  // data:[
  //   {text:'learn angular', checked:true,createdBy:'userId',creatorName:'Sharan'},
  //   {text:'build an angular app', checked:false,createdBy:'userId',creatorName:'Sharan'}
  //   ]},{
  //   heading:"Group 2",
  //   checked:1,
  //   data:[
  //   {text:'learn angular', checked:true,createdBy:'userId',creatorName:'Sharan',createdBy:'userId',creatorName:'Sharan'},
  //   {text:'build an angular app', checked:false,createdBy:'userId',creatorName:'Sharan',createdBy:'userId',creatorName:'Sharan'}
  //   ]},{
  //   heading:"Group 3",
  //   checked:1,
  //   data:[
  //   {text:'learn angular', checked:true,createdBy:'userId',creatorName:'Sharan'},
  //   {text:'build an angular app', checked:false,createdBy:'userId',creatorName:'Sharan'}
  //   ]}];

  // $scope.addChecklistGroup = function() {
  // console.log($scope.todoGroupText);
  //   $scope.todos.push({
  //   checklistHeading:$scope.todoGroupText ,
  //   checkedCount:0,
  //   items:[{text:'learn angular', checked:false,createdBy:'userId',creatorName:'Sharan'},
  //   {text:'build an angular app', checked:false,createdBy:'userId',creatorName:'Sharan'}]
  //   });
  //   $scope.todoText = '';
  //   $uibModalInstance.dismiss('cancel');
  // };

  $scope.addTodoItem = function(todo) {
    //console.log(todo)
    todo.items.push({"text":todo.todoText,"done":false})
    todo.todoText = '';
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

  $scope.delete = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };
  //TODO Ends
}]);

//
// app.controller('modalController', function($scope, $uibModalInstance, params) {
//   $scope.ok = function() {
//     $uibModalInstance.dismiss('cancel');
//   };
//   $scope.cancel = function() {
//     $uibModalInstance.dismiss('cancel');
//   };
// })

//Below code was as part of edit description. this can be deleted as srini as used other approach

// story.directive('contenteditable', function() {
//   return {
//     require: 'ngModel',
//     link: function(scope, elm, attrs, ctrl) {
//       // view -> model
//       console.log("blur triggered");
//       elm.bind('blur', function() {
//         scope.$apply(function() {
//           ctrl.$setViewValue(elm.html());
//         });
//       });
//
//       // model -> view
//       ctrl.render = function(value) {
//         elm.html(value);
//       };
//
//       // load init value from DOM
//       ctrl.$setViewValue(elm.html());
//
//       elm.bind('keydown', function(event) {
//         console.log("keydown " + event.which);
//         var esc = event.which == 27,
//         el = event.target;
//
//         if (esc) {
//           console.log("esc");
//           ctrl.$setViewValue(elm.html());
//           el.blur();
//           event.preventDefault();
//         }
//
//       });
//
//     }
//   };
//
// });
