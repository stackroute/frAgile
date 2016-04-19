var fragileApp = angular.module('fragileApp');

fragileApp.controller('menuController', function($scope, $http, Socket, activityService, $rootScope) {

  var socket = Socket();

  //For members list
  $scope.memberList = [];
  activityService.getMembers($scope.projectID).success(function(response) {
    response.memberList.forEach(function(data) {
        data.fullName = data.firstName + " " + data.lastName;
      })
      // $rootScope.memberList.push(data.firstName + " " + data.lastName);
      // console.log(response[0]);
      // console.log(response);
    $scope.memberList = response.memberList;
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

  // Autocomplete Search
  $scope.users = [];
  $scope.updateSearch = function(typed) {
      $scope.users = [];
      $scope.newUsers = activityService.getUsers(typed).success(function(data) {
        data.forEach(function(user) {
          $scope.users.push(user.email);
        })
      });
    }
    // $scope.roomName = 'activity:' + $scope.projectID,
  $scope.saveMember = function() {
    socket.emit('activity:addMember', {
      'room': 'activity:' + $scope.projectID,
      'projectId': $scope.projectID,
      'memberList': $scope.userIds
    });
    $scope.members = "";

    $scope.userIds.forEach(function(userId, index) {
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

  socket.on('activity:memberAdded', function(data) {
    data.fullName = data.firstName + " " + data.lastName;
    $scope.memberList.push(data);
    $scope.allMembers = [];
    $scope.userIds = [];
    $scope.members = "";
    $scope.addedMembers = "Success: Members Added To Project!";
  });

  socket.on('activity:memberRemoved', function(userData) {
    var fullName = userData.firstName + " " + userData.lastName;
    $scope.memberList.forEach(function(data) {
      if (userData._id == data._id)
        $scope.memberList.pop();
    });

    var data = {
      room: 'activity:' + $scope.projectID,
      action: "removed",
      projectID: $scope.projectID,
      user: {
        '_id': $scope.userID,
        'fullName': $scope.fullName
      },
      object: {
        name: fullName,
        type: "User",
        _id: userData._id
      },
      target: {
        name: $scope.projectName,
        type: "Project",
        _id: $scope.projectID
      }
    }
    socket.emit('addActivity', data);
  })

  $scope.removeMember = function(memberId) {
    console.log('Remove Member: ', memberId);

    socket.emit('activity:removeMember', {
      'room': 'activity:' + $scope.projectID,
      'projectId': $scope.projectID,
      'memberId': memberId
    });



  }


});
