fragileApp.controller('cardsController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'cardsService', 'Socket', '$filter', 'graphModalFactory','homeService',function($scope, $state, $rootScope, $stateParams, $uibModal, cardsService, Socket, $filter, graphModalFactory,homeService) {

  var socket = Socket($scope);
  $scope.loadCards=function(){

    cardsService.getUserCards().success(function(response) {
      $rootScope.cards = response.assignedStories;
      console.log(response.assignedStories);
      var storyIdArr=[];
      for(obj in $rootScope.cards)
      {
        storyIdArr=obj.storyId;
      }

      cardsService.getUserStories(storyIdArr).success(function(response){
        $scope.stories=response;
      })
    }
  )};

}
]);
