fragileApp.controller('projectController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'projectService', 'Socket', '$filter', 'graphModalFactory',
  function($scope, $state, $rootScope, $stateParams, $uibModal, projectService, Socket, $filter,graphModalFactory) {
    // $scope.loadProjects = function() {
    //
    //   projectService.getUserProjects().success(function(response) {
    //     $rootScope.projects = response.projects
    //   });
    //
    //   $rootScope.defaultDate =  $filter('date')(Date.now(), "yyyy-MM-dd");
    // }
    var socket = Socket($scope);

    projectService.getCurrentUser().success(function(response) {
      socket.emit('join:room', {
        'room': "user:" + response._id
      });
    })


    socket.on('releaseDeleted', function(releaseData) {
      $rootScope.projects.forEach(function(project) {
        if (project._id == releaseData.projectId) {
          project.release.forEach(function(release, index) {
            if (release._id == releaseData.releaseId) {
              var releaseName = release.name; //For activity
              project.release.splice(index, 1);
            }
          })
        }
      })
    })

    // Opening Modal window for Release Chart
    $scope.openReleaseChart = function() {
      graphModalFactory.open('lg', './components/releaseChart/releaseChart.html', "Release Chart");
    };

    // Opening Modal window for Overview Chart
    $scope.showOverGraph = function() {
      graphModalFactory.open('lg', './components/releaseChart/overViewChart.html', "Overview Graph");
    };

  $scope.longDescLimit = 38;
  $scope.longPrjDescLimit = 120;
  $scope.setDefaultForRelease = function(projectId) {

    $scope.addWhat = "Release";
    $scope.projectId = projectId;
    projectService.setData($scope.addWhat, projectId);
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/components/project/project.modal.html',
      controller: 'modalController',
      controllerAs: 'modalContr'
    });
  }
  $scope.setDefaultForProject = function(projectId) {
    $scope.dismissThis = "none";
    $scope.addWhat = "Project";
    $scope.warningModalDesc = true;
    $scope.warningModalName = true;
    $scope.warningModalDate = true;
    projectService.setData($scope.addWhat);
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/components/project/project.modal.html',
      controller: 'modalController',
      controllerAs: 'modalContr'
    });
  }
  $scope.closeThis = function() {
    $uibModalInstance.dismiss('cancel');
  }
  $scope.editProject = function(newProjectName,newProjectDetails,prId) {
    console.log(newProjectName);
    console.log(newProjectDetails);
    console.log(prId);
    if (newProjectName!="") {
      socket.emit('project:editProject', {
        'room': 'projectRoom',
        'name': newProjectName,
        'description': newProjectDetails,
        "prId": prId
      });
      return true;
    }
    else {
      return false;
    }
  };
  $scope.editRelease = function(newReleaseName,newReleaseDetails,newReleaseDate,creationDate,prId,relId,oldName) {
      if (newReleaseDate != null && creationDate != null && newReleaseName != "") {
        var dt = new Date(newReleaseDate);
        var crDt = new Date(creationDate);
        socket.emit('project:editRelease', {
          'room': 'projectRoom',
          'projectId': prId,
          'releaseId': relId,
          "name": newReleaseName,
          "description": newReleaseDetails,
          "creationDate": crDt,
          "releaseDate": dt,
          "oldReleaseName": oldName
        });
        return true;
      } else {
        return false;
      }
    }
    $scope.setReleaseToDelete = function(projectId, releaseId, projectName, releaseName) {
      $scope.toDeleteProjectId = projectId;
      $scope.toDeleteReleaseId = releaseId;
      $scope.toDeleteProjectName = projectName;
      $scope.toDeleteReleaseName = releaseName;
    }
    $scope.archiveFun = function() {
      // console.log("archiveFun" + rel)
      socket.emit('deleteRelease', {
        'room': 'projectRoom',
        'activityRoom': 'activity:' + $scope.toDeleteProjectId,
        'projectId': $scope.toDeleteProjectId,
        'releaseId': $scope.toDeleteReleaseId,
        'releaseName': $scope.toDeleteReleaseName,
        'projectName': $scope.toDeleteProjectName
      });
    };
    $scope.editFun = function(rel) {

    };
    $scope.starFun = function(rel) {
      console.log("starFun" + rel);
    };

    $scope.setProject = function(projectId, projectName, releaseId, releaseName, releaseDesc) {
      $rootScope.projectName = projectName,
        $rootScope.release = {};
      $rootScope.releaseName = releaseName;
      $rootScope.release.description = releaseDesc;
    }

    socket.on('project:releaseEdited', function(releaseData) {
      console.log(releaseData);
      console.log("--------------");
      $rootScope.projects.forEach(function(item, itmIndex) {
        if (item._id == releaseData.prId) {
          item.release.forEach(function(rel, relIndex) {
            if (rel._id == releaseData._id) {
              console.log($rootScope.projects[itmIndex].release[relIndex]);
              $rootScope.projects[itmIndex].release[relIndex].name = releaseData.name;
              $rootScope.projects[itmIndex].release[relIndex].description = releaseData.description;
              $rootScope.projects[itmIndex].release[relIndex].releaseDate = releaseData.releaseDate;
            }
          });
        }
      });
      //console.log(releaseData);
    });

  socket.on('project:projectEdited', function(newProject) {
    console.log("----projectEdited----");
    console.log(newProject);
    $rootScope.projects.forEach(function(project, projectIndex) {
      if (project._id == newProject._id) {
        $rootScope.projects[projectIndex].name = newProject.name;
        $rootScope.projects[projectIndex].description = newProject.description;
      }
    });
  });
  socket.on('project:releaseEdited', function(releaseData) {
    console.log(releaseData);
    console.log("--------------");
    $rootScope.projects.forEach(function(item, itmIndex) {
      if(item._id == releaseData.prId){
        item.release.forEach(function(rel, relIndex) {
          if(rel._id == releaseData._id){
            console.log($rootScope.projects[itmIndex].release[relIndex]);
            $rootScope.projects[itmIndex].release[relIndex].name = releaseData.name;
            $rootScope.projects[itmIndex].release[relIndex].description = releaseData.description;
            $rootScope.projects[itmIndex].release[relIndex].releaseDate = releaseData.releaseDate;
          }
        });
      }

    });
});
    // FIXME: Code duplicated in Menu controller. Can be fixed
    var dbIds;
    $scope.getAllUsers = function(projectID, projectName) {
      $scope.selectedProject = projectID;
      $scope.selectedProjectName = projectName;
      projectService.getMembers($scope.selectedProject).success(function(response) {
        response.memberList.forEach(function(data) {
          data.fullName = data.firstName + " " + data.lastName;
        })
        $scope.projMemberList = response.memberList;
      });

      $scope.dbUsers = [];
      dbIds = [];
      projectService.getAllUsers().success(function(response) {
        response.forEach(function(data) {
          $scope.dbUsers.push(data.email);
          dbIds.push(data._id);
        });
      });
    }

    $scope.addMember = function() {
      var userFound = false;
      var addedUserId = "";
      $scope.dbUsers.forEach(function(value, index) {
        if (value == $scope.addedUserEmail) {
          addedUserId = dbIds[index];
          userFound = true;
        }
      });

      if (userFound == false) {
        alert('User Not Found!');
        $scope.addedUserEmail = "";
      } else {
        socket.emit('activity:addMember', {
          'room': 'activity:' + $scope.selectedProject,
          'projectId': $scope.selectedProject,
          'memberList': [addedUserId],
          'projectName': $scope.selectedProjectName
        });

        $scope.addedUserEmail = "";
      }
    }

    socket.on('project:memberAdded', function(data) {
      data.fullName = data.firstName + " " + data.lastName;
      $scope.projMemberList.push(data);
    });

    socket.on('project:addMemberFailed', function(data) {
      alert(data);
    });

  }
]);
