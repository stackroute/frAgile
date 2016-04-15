fragileApp.factory('storyService',['$http',function($http) {

    this.getStoryDetails = function() {
      return  $http.get('/story');
    };
      this.saveStoryDescription = function(storyId,desc) {
    //    console.log("inside story factory");
        return  $http.post('/story/saveStoryDescription?id='+storyId+'&desc='+desc);
      };

      this.addChecklistGroup = function(storyId,checklistObj) {
    //    console.log("inside story factory");
        return  $http.post('/story/addchecklistgroup?storyId='+storyId+'&checklistObj='+checklistObj);
      };

  return this;

}]);

fragileApp.factory('modalService', function($uibModal) {
    return {
      open: function(size, template,subController, params) {
        return $uibModal.open({
          animation: true,
          templateUrl: template,
          controller: subController,
          size: size,
          resolve: {
            param: function() {
              console.log("params in modal factory :::::  ");
              console.log(subController);
              return params;
            }
          }
        });
      }
    };
  })
