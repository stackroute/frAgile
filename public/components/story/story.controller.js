fragileApp.controller('storyController',['$scope','$rootScope','$stateParams','storyFactory',function($scope,$rootScope,$stateParams,projectFactory){
  $scope.getStory = function() {
    storyFactory.getStoryDetails().then(function(storyDetails) {
      $scope.story = storyDetails.data;
      // console.log(projects);
    });
  };
}]);
