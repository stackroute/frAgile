fragileApp.config(function($stateProvider,$urlRouterProvider){
  var currentPosition={};
  $stateProvider
  .state('cardsPage.story',{
    url : ':sprintID/:storyID',
    params:{prId:null},
    onEnter: function($stateParams, $state, $uibModal,sprintService,$rootScope) {
console.log("param:");
console.log($stateParams);
      sprintService.getSprints($stateParams.sprintID).then(function(sprintObj){
        sprintService.getStory($stateParams.storyID).then(function(storyObj){


          sprintObj.data.list.forEach(function(list){
            console.log(list);
            list.stories.forEach(function(story){
              console.log(story);
              if(story._id===storyObj.data._id){
                currentPosition.listId=list._id;
                currentPosition.listItemName=list.listName;

              }
            })
          });

          modalInstance=  $uibModal.open({

            templateUrl: '/components/story/story.view.html',
            controller: 'storyController',
            controllerAs: 'storyContr',

            animation:'true',

            size: 'lg',
            resolve: {
              param: function() {

                return{
                  projectId:$stateParams.prId,
                  story: storyObj,
                  sprint: sprintObj.data,
                  projMembers: $rootScope.projMemberList, //TODO:Check if this can be sent directly instead of resolve
                  storyGrp: storyObj.data.listId,
                  currentPosition: currentPosition
                }

              }

            }

          });
          modalInstance.result.then(function () {


                $state.go('cardsPage',{},{reload:true});
            }, function () {
                $state.go('cardsPage',{},{reload:true});
         });

        });


      });
    }
  });
});
