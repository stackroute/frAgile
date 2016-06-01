fragileApp.controller('cardsController', ['$scope', '$state', '$rootScope', '$stateParams', '$uibModal', 'cardsService', 'Socket', '$filter', 'graphModalFactory','homeService',function($scope, $state, $rootScope, $stateParams, $uibModal, cardsService, Socket, $filter, graphModalFactory,homeService) {

  var socket = Socket($scope);
  $scope.loadCards=function(){
$scope.cards={};
    // cardsService.getUserCards().success(function(response) {
    //   $rootScope.cards = response.assignedStories;
    //   console.log($rootScope.cards);
    //   var storyIdArr=[];
    //   var i=0;
    //   $rootScope.cards.forEach(function(item){
    //     storyIdArr[i++]=item.storyId;
    //   })
    //   console.log(storyIdArr);
    //
    //   cardsService.getUserStories(storyIdArr).success(function(response){
    //     $scope.stories=response;
$scope.cards["assignedStories"] = [
                {
                        "projectId" :  ("57457a595f7cd5602ee34db7"),
                        "projectName" : "Project1",
                        "releaseId" :  ("57457a665f7cd5602ee34dba"),
                        "releaseName" : "Release1",
                        "sprintId" :  ("57457a7a5f7cd5602ee34dbc"),
                        "sprintName" : "Sprint1",
                        "storyId" :  ("574d81f998e7c36e7c9843ec"),
                        "storyName" : "Story in sprint1"
                },
                {
                        "projectId" :  ("57457a595f7cd5602ee34db7"),
                        "projectName" : "Project1",
                        "releaseId" :  ("57457a665f7cd5602ee34dba"),
                        "releaseName" : "Release1",
                        "sprintId" :  ("57457a7a5f7cd5602ee34dbc"),
                        "sprintName" : "Sprint1",
                        "storyId" :  ("574d823198e7c36e7c9843f5"),
                        "storyName" : "Story2 in sprint1"
                },
                {
                        "projectId" :  ("57457a595f7cd5602ee34db7"),
                        "projectName" : "Project1",
                        "releaseId" :  ("57457a665f7cd5602ee34dba"),
                        "releaseName" : "Release1",
                        "sprintId" :  ("57457a7a5f7cd5602ee34dbd"),
                        "sprintName" : "Sprint2",
                        "storyId" :  ("574d823198e7c36e7c9843f5"),
                        "storyName" : "Story3 in sprint2"
                },
                {
                        "projectId" :  ("57457a595f7cd5602ee34db7"),
                        "projectName" : "Project1",
                        "releaseId" :  ("57457a665f7cd5602ee34dba"),
                        "releaseName" : "Release1",
                        "sprintId" :  ("57457a7a5f7cd5602ee34dbd"),
                        "sprintName" : "Sprint2",
                        "storyId" :  ("574d823198e7c36e7c9843f5"),
                        "storyName" : "Story4 in sprint2"
                },
                {
                        "projectId" :  ("57457a595f7cd5602ee34db7"),
                        "projectName" : "Project1",
                        "releaseId" :  ("57457a665f7cd5602ee34dba"),
                        "releaseName" : "Release1",
                        "sprintId" :  ("57457a7a5f7cd5602ee34dbd"),
                        "sprintName" : "Sprint2",
                        "storyId" :  ("574d823198e7c36e7c9843f5"),
                        "storyName" : "Story5 in sprint2"
                },
                {
                        "projectId" :  ("57457a595f7cd5602ee34db7"),
                        "projectName" : "Project1",
                        "releaseId" :  ("57457a665f7cd5602ee34dba"),
                        "releaseName" : "Release1",
                        "sprintId" :  ("57457a7a5f7cd5602ee34dbe"),
                        "sprintName" : "Sprint3",
                        "storyId" :  ("574d823198e7c36e7c9843f5"),
                        "storyName" : "Story6 in sprint3"
                }
        ]












        // keys=[];
        // sprints=[];
        // $rootScope.cards.forEach(function(item){
        //   $scope.stories.forEach(function(story){
        //     if(item.storyId==story._id)
        //     {
        //       if(keys.indexOf(item.sprintId)>=0)
        //       {
        //
        //         sprints[keys.indexOf(item.sprintId)]['story'].push(story);
        //       }
        //       else{
        //         keys.push(item.sprintId);
        //         newStory=[];
        //         newStory.push(story);
        //         var obj={}
        //         obj['key']=item.sprintId;
        //         obj['story']=newStory;
        //         sprints.push(obj);
        //         // sprints.push([{item.sprintId:story}]);
        //       }
        //     }
        //   })
        // })
        //
        // $scope.sprints=sprints;








        // console.log(JSON.stringify(sprints));
  //     })
  //   }
  //

}}
]);
