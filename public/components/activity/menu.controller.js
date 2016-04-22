var fragileApp = angular.module('fragileApp');

fragileApp.controller('menuController', function($scope, $http, Socket, activityService, $rootScope) {

  var socket = Socket();

  //For members list
  $rootScope.projMemberList = [];
  activityService.getMembers($rootScope.projectID).success(function(response) {
    response.memberList.forEach(function(data) {
        data.fullName = data.firstName + " " + data.lastName;
      })
    $rootScope.projMemberList = response.memberList;
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
      console.log('User Email: ', $rootScope.currentUserEmail);
      $scope.newUsers = activityService.getUsers(typed).success(function(data) {
        data.forEach(function(user) {
          if(user.email != $rootScope.currentUserEmail)
            $scope.users.push(user.email);
        })
      });
      console.log('Exit Search');
    }
    // $scope.roomName = 'activity:' + $rootScope.projects[$rootScope.projectKey]._id,
  $scope.saveMember = function() {
    socket.emit('activity:addMember', {
      'room': 'activity:' + $rootScope.projectID,
      'projectId': $rootScope.projectID,
      'memberList': $scope.userIds,
      'projectName' : $scope.projectName
    });
    $scope.members = "";

  }

  socket.on('activity:memberAdded', function(data) {
    data.fullName = data.firstName + " " + data.lastName;
    $rootScope.projMemberList.push(data);
    $scope.allMembers = [];
    $scope.userIds = [];
    $scope.members = "";
    $scope.addedMembers = "Success: Members Added To Project!";
  });

  socket.on('activity:memberRemoved', function(userData) {
    var fullName = userData.firstName + " " + userData.lastName;
    $rootScope.projMemberList.forEach(function(data,index){
      if(userData._id == data._id)
        $rootScope.projMemberList.splice(index,1);

    });


  })

  $scope.removeMember = function(memberId) {

    socket.emit('activity:removeMember', {
      'room': 'activity:' + $rootScope.projectID,
      'projectId': $rootScope.projectID,
      'memberId': memberId
    });

  }


});
