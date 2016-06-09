fragileApp.controller('cardsController', ['$scope', '$state','sprintService', '$rootScope', '$stateParams', '$uibModal', 'cardsService', 'Socket', '$filter', 'graphModalFactory','homeService',function($scope, $state,sprintService, $rootScope, $stateParams, $uibModal, cardsService, Socket, $filter, graphModalFactory,homeService) {

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
      $rootScope.cards = response.assignedStories;
      console.log($rootScope.cards);
       var storyIdArr=[];
      var i=0;
       $rootScope.cards.forEach(function(item){
         storyIdArr[i++]=item.storyId;
      })
       console.log(storyIdArr);

       cardsService.getUserStories(storyIdArr).success(function(response){
         $scope.stories=response;
console.log($scope.stories);



socket.on('story:memberRemoved',function(data){
console.log("you are removed");
})
      })
     });

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
