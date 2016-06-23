fragileApp.controller('cardsController', ['$scope', '$state','sprintService', '$rootScope', '$stateParams', '$uibModal','uibDateParser', 'cardsService', 'Socket', '$filter', 'graphModalFactory','homeService',function($scope, $state,sprintService, $rootScope, $stateParams, $uibModal,uibDateParser, cardsService, Socket, $filter, graphModalFactory,homeService) {

  var socket = Socket($scope);
  $rootScope.inprojectRoom=false;


  console.log($stateParams);
  $scope.loadCards=function(){

    sprintService.currentRoom={};

    var emitData={
      'room' :$rootScope.currentUserID
    };
    console.log(emitData);
    socket.emit('join:room', emitData);

    //$scope.cards={};
    $scope.stories=[];
    cardsService.getUserCards().success(function(response) {
      $rootScope.cards = response[0].assignedStories;
      console.log(response[0].assignedStories);
      console.log($rootScope.cards);

      $rootScope.cards.forEach(function(item){
        console.log(item);

      })

      $scope.getNames=function(card){
        sprintService.getProject(card.sprintId).then(function(projObj){
          $scope.projectName=projObj.data[0].name;
          console.log(projObj);
//           $scope.releaseName=projObj.data[0].release.forEach(function(releaseItem){
// if(releaseItem._id===card.releaseId)
// console.log($scope.releaseName);
// })
          console.log($scope.releaseName);
        });
        //
        sprintService.getSprints(card.sprintId).then(function(sprintObj){
          $scope.sprintName=sprintObj.data.name;
        });


      }

      //console.log($scope.sprint);

    });

  }


  //filter cards on date
  $scope.applyFilter=function(){

  }




  socket.on('story:memberAssigned',function(data){
    $scope.stories=[];
    $scope.stories.push(data);
    //console.log(data.length);
    console.log("you are added");
    console.log($scope.stories);

  })

  socket.on('story:memberRemoved',function(data)
  {
    $scope.stories = $filter('filter')($scope.stories, {_id: !data._id})

  });


  $scope.gotoProject=function(){
    $state.go('project');
  }
  $scope.goToSprint=function(params,story){
    $state.go('sprint',params).then(function(){
      //$rootScope.showModal(story._id, listItem.group,listItem._id,listItem.listName);\
      console.log(story._id+"in then");
      angular.element("#"+story._id).triggerHandler("ng-click");
    })
  }
}
]);
