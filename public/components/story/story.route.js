fragileApp.config(function($stateProvider,$urlRouterProvider){

  $stateProvider
  .state('sprint.story',{
    templateUrl: 'components/story/story.view.html',
    controller: 'storyController'
  });
});
