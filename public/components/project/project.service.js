angular.module('fragileApp').factory('projectService', ['$http', 'socket',function($http,socket) {

  return {
    getUserProjects: function(userID) {
      var url = '/user/projects?id=' + userID;
      return $http.get(url);
    },
    addRelease: function(projectID, name, desc, dt) {
      data = {
        room:'projectRoom',
        projectID: projectID,
        name: name,
        desc: desc,
        dt: dt
      }
      socket.emit('project:add release', data);
      // var req = {
      //   method: 'POST',
      //   url: '/project/release',
      //   data: {
      //     projectID: projectID,
      //     name: name,
      //     desc: desc,
      //     dt: dt
      //   }
      // }
      // return $http(req);
    },
    addProject: function(name, desc) {
      var req = {
        method: 'POST',
        url: '/project',
        data: {
          name: name,
          desc: desc
        }
      }
      return $http(req);
    },
    addProjectToUser: function(userID, projectID) {
      var req = {
        method: 'POST',
        url: '/user/addProject',
        data: {
          projectID: projectID,
          userID: userID
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
