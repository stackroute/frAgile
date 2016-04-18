angular.module('fragileApp').factory('projectService', ['$http', 'Socket',function($http,Socket) {

  return {
    getUserProjects: function() {
      var url = '/user/projects?id=' ;
      return $http.get(url);
    },
    addProject: function(name, desc) {
      var req = {
        method: 'POST',
        url: '/project',
        data: {
          name: name,
          desc: desc,
        }
      }
      return $http(req);
    },
    addProjectToUser: function( projectID) {
      var req = {
        method: 'POST',
        url: '/user/addProject',
        data: {
          projectID: projectID,
        }
      }
      return $http(req);
    },
    setData: function(name, id) {
      this.addWhat = name;
      this.addId = id;
    }
  }
}]);
