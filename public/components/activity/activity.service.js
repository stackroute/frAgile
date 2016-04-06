// Prepositions to add to activity based on the action
var prepositionsMap = {
  "added": " to ",
  "created": " the ",
  "commented": " on ",
  "moved": " to ",
  "changed": " to "
};

angular
  .module('fragileApp')
  .factory('activityService', ['$http', function($http) {

    return {
      getProjectData: function(projectID) {
        // Retrieves the activity for the given projectID
        var url = '/activity?project=' + projectID;
        // Returns a promise
        return $http.get(url);
      },

      parseData: function(data) {
        // Adds a preposition
        data.preposition = prepositionsMap[data.action];
        // Adds activity corresponding time from now
        data.timeAgo = moment(data.date).fromNow();

        // Adds a class based on target type
        switch (data.target.kind) {
          case "Story":
            data.targetClass = "activity-object-link";
            break;
          default:
            data.targetClass = "activity-object-link-disabled";
            break;
        }

        // Adds a class to object if object exists
        if (data.object) {
          switch (data.object.kind) {
            case "Story":
              data.objectClass = "activity-object-link";
              break;
            case "User":
              data.objectClass = "activity-username activity-object-link-disabled";
              break;
            case "Comment":
              data.objectClass = "activity-comment";
              break;
            default:
              data.objectClass = "activity-object-link-disabled";
              break;
          }
        }
      },

      moreActivity: function(projectID, page){
        // Retrieves top 10 activity for the given projectID
        var url = '/activity?project=' + projectID + '&page=' + page;
        // Returns a promise
        return $http.get(url);

      },

      getMembers: function(projectID){

        var url = '/project/memberList?id=' + projectID

        return $http.get(url);
      }
    }


  }])
