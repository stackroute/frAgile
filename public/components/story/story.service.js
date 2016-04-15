var story = angular.module('fragile');

story.factory('storyFactory',['$http',function($http) {

  this.getStoryDetails = function() {
    return  $http.get('/story');
  };

  return this;

}]);
