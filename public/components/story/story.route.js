var angularModule = angular.module('fragile');

angularModule.config(function($stateProvider,$urlRouterProvider){

  $stateProvider
  .state('project',{
    templateUrl: 'components/story/story.view.html',
    controller: 'storyController'
  });
});
