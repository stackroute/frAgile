fragileApp.controller('cardsController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'cardsService', 'Socket', '$filter', 'graphModalFactory','homeService',function($scope, $state, $rootScope, $stateParams, $uibModal, cardsService, Socket, $filter, graphModalFactory,homeService) {

  var socket = Socket($scope);
  $scope.loadCards=function(){
//$scope.cards={};
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
      })
     });

}
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
