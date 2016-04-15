var fragileApp = angular.module('fragileApp');

fragileApp.controller('activityController', function($scope, $http, socket, activityService) {

  // Based on the project clicked, send its projectID to display its corresponding activity
  activityService.getProjectData($scope.projectID).success(function(response) {
    // For each activity, go to activityService and add the preposition, etc
    $scope.page = 1;
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
    $scope.page = parseInt($scope.page) + 1;
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
$scope.memberList = [];
  activityService.getMembers($scope.projectID).success(function(response) {
    response[0].memberList.forEach(function(data) {
      $scope.memberList.push(data.firstName + " " + data.lastName);
    })
  });

  socket.on('activityAdded', function(data) {
    // console.log('Added activity');
    activityService.parseData(data);
    $scope.activities.unshift(data);

  });

  $scope.allMembers = [];
  $scope.userIds = [];
  $scope.addMember = function() {
    activityService.getUserId($scope.members).success(function(response) {
      if (response.length > 0) {
        $scope.allMembers.push(response[0].firstName + " " + response[0].lastName);
        $scope.addedMembers = $scope.allMembers.join(", ");
        $scope.userIds.push(response[0]._id);
      } else {
        alert('Error: User Not Found!');
      }
    })
  }

  // $scope.roomName = 'activity:' + $scope.projectID,
  $scope.saveMember = function() {
    socket.emit('activity:addMember', {
      'room': 'activity:' + $scope.projectID,
      'projectId': $scope.projectID,
      'memberList': $scope.userIds
    });
    $scope.members = "";

    $scope.userIds.forEach(function(userId, index){
      var data = {
        room: 'activity:' + $scope.projectID,
        action: "added",
        projectID: $scope.projectID,
        user: {
          '_id': $scope.userID,
          'fullName': $scope.fullName
        },
        object: {
          name: $scope.allMembers[index],
          type: "User",
          _id: userId
        },
        target: {
          name: $scope.projectName,
          type: "Project",
          _id: $scope.projectID
        }
      }
      socket.emit('addActivity', data);
    })

  }

  socket.on('activity:memberAdded', function(data){
    $scope.allMembers.forEach(function(member){
        $scope.memberList.push(member);
    })
    $scope.allMembers = [];
    $scope.userIds = [];
    $scope.members = "";
    $scope.addedMembers = "Success: Members Added To Project!";
  });

  // socket.on('activityAdded', function(data){
  //
  // })





});
