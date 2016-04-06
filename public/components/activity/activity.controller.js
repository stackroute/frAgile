var fragileApp = angular.module('fragileApp');

fragileApp.controller('activityController', function($rootScope, $scope, $http, socket, activityService) {

  // Based on the project clicked, send its projectID to display its corresponding activity
  activityService.getProjectData($scope.projectID).success(function(response) {
    // For each activity, go to activityService and add the preposition, etc
    response.forEach(function(data) {
      activityService.parseData(data);
    });
    // Save the above parsed data into 'activities' model
    $scope.activities = response;
  });

  // Refresh the activity time every 45 sec
  setInterval(refreshTimeStamp, 45000);

  function refreshTimeStamp() {
    var response = $scope.activities;
    response.forEach(function(data) {
      data.timeAgo = moment(data.date).fromNow();
    });
    $scope.$apply();
  }

  // Click function for moreActivity
  $scope.moreActivity = function() {
    // Add +1 to page everytime moreActivity is clicked
    // Added before passing to service coz 1st time on page load it will show 1st page results
    $scope.page = ($scope.page ? parseInt($scope.page) : 1 ) + 1;
    activityService.moreActivity($scope.projectID, $scope.page).success(function(response) {
      // For each activity, go to activityService and add the preposition, etc
      if (response.length > 0) {
        response.forEach(function(data) {
          activityService.parseData(data);
          // Push the above parsed data into 'activities' model to show all existing activities as well
          $scope.activities.push(data);
        });
        $scope.moreData = false;
      } else {
        $scope.moreData = true;
      }

    });
  }

  //For members list
  activityService.getMembers($scope.projectID).success(function(response) {
    response[0].memberList.forEach(function(data) {
      data.fullName = data.firstName + " " + data.lastName;
    })
    $scope.memberList = response[0].memberList;
  });

  // $rootScope.isMenu = false;

  socket.on('new activity', function(data) {
    activityService.parseData(data);
    $scope.activities.unshift(data);
  });






});
