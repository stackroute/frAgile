fragileApp.controller('projectController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'projectService', 'Socket', '$filter', 'graphModalFactory','homeService',
function($scope, $state, $rootScope, $stateParams, $uibModal, projectService, Socket, $filter, graphModalFactory,homeService) {

  var socket = Socket($scope);
  $scope.loadCards=function(){
    cardsService.getUserCards().success(function(response) {
      $rootScope.cards = response;
      var storyIdArr=[];
      for(obj in $rootScope.cards)
      {
        storyIdArr=obj.storyId;
      }

      cardsService.getUserStories(storyIdArr).success(function(response){
        $scope.stories=response;
      })
    }

  }
]);
