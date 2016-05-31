angular.module('fragileApp').factory('cardsService', ['$http', 'Socket',function($http,Socket) {


  return {
    getUserCards: function() {
      var url = '/user/cards' ;
      return $http.get(url);
    },
    getUserStories: function(storyIdArr) {

      var url ='/story/getStories';
      return $http.get(url);
    }
  }


}]);
