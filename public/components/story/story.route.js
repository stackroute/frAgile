fragileApp.config(function($stateProvider,$urlRouterProvider){

  $stateProvider
  .state('story',{
    templateUrl: 'components/story/story.view.html',
    controller: 'storyController'
  });
});
