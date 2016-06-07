fragileApp.config(function($stateProvider,$urlRouterProvider){
  var currentPosition={};
  $stateProvider
  .state('sprint.story',{
    url : '/:storyID',
    onEnter: function($stateParams, $state, $uibModal,sprintService,$rootScope) {
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

            size: 'lg',
            resolve: {
              param: function(sprintService) {

                return{
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
alert("in modal result");
                $state.go('sprint');
            }, function () {
alert("in modal result");
                $state.go('sprint');
         });
        });


      });
    }
  });
});
