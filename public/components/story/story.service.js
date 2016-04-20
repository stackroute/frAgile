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

/***
author:sharan
function:getStoryCopyMovementData
parameters:projectId
description: This function is used to get the whole set of data particular to a project to copy\move the story across the releases\sprints of  project
***/
      this.getStoryCopyMovementData = function(projectId){
        console.log("projectId"+projectId);
        return $http.post('/project/getstorymovedata?id='+projectId);
      }

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
