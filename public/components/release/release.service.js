angular.module('fragileApp').factory('releaseService', ['$http', function($http) {

    return {
      getSprints: function(releaseID) {
        var url = '/project/sprints?releaseID=' + releaseID;
        return $http.get(url);
      },

      addSprint : function(name, desc) {
        return $http.post('/project?name=' + name + '&desc=' + desc);
      }
    }
  }]);
