fragileApp.factory('sprintService',['$http',function($http) {

  this.getSprints = function(sprintId) {
    return  $http.get('/sprint?id='+sprintId);
  };

  this.getBackBug = function(prId) {
    return  $http.get('/project/backLogsBugList/?projId='+prId);
  };

  return this;

}]);
