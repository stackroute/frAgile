angular.module('fragileApp').factory('homeService', ['$http', 'Socket',function($http,Socket) {

  return {
    getUserProjects: function() {
      var url = '/user/projects' ;
      return $http.get(url);
    },
    getUserDetails: function() {
      var url = '/user/getUserDetails' ;
      return $http.get(url);
    },
    getSprints: function(releaseID) {
      var url = '/project/sprints?releaseID=' + releaseID;
      return $http.get(url);
    },
    getCurrentUser: function(){
      return $http.get("/user");
    }
  }
}]);
