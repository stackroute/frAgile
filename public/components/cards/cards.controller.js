fragileApp.controller('cardsController', ['$scope', '$state','sprintService', '$rootScope', '$stateParams', '$uibModal','uibDateParser', 'cardsService', 'Socket', '$filter', 'graphModalFactory','homeService',function($scope, $state,sprintService, $rootScope, $stateParams, $uibModal,uibDateParser, cardsService, Socket, $filter, graphModalFactory,homeService) {

 var socket = Socket($scope);
 $rootScope.inprojectRoom=false;
 $scope.setDate=function(){

   var date=new Date();
   $scope.startDate= moment(date).day(6).format('DD-MM-YYYY');
   $scope.endDate= moment(date).day(6).format('DD-MM-YYYY');
   $scope.daterange=$scope.startDate+'-'+$scope.endDate;
 }
 console.log($stateParams);
 $scope.loadCards=function(){

   sprintService.currentRoom={};
   console.log($rootScope);

   var emitData={
     'room' :$scope.currentUserID
   };
   console.log(emitData);
   socket.emit('join:room', emitData);

   //$scope.cards={};
   $scope.stories=[];
   cardsService.getUserCards().success(function(response) {
     $scope.cards = response[0].assignedStories;
     console.log(response[0].assignedStories);


     $scope.cards.forEach(function(item){
       $rootScope.projects.forEach(function(projObj){
         if(item.projectId===projObj._id)
         {
           item.projectName=projObj.name
           projObj.release.forEach(function(relObj){
             if(item.releaseId===relObj._id){item.releaseName=relObj.name}
           })
         }
       })
     })
   })




   socket.on('story:memberAssigned',function(data){
     //$scope.stories=[];
     $scope.cards.push(data);
     $scope.loadCards();
     //console.log(data.length);
     console.log("you are added");
     console.log($scope.cards);

   })

   socket.on('story:memberRemoved',function(data)
   {
     console.log("memberRemoved",data);
     $scope.cards = $filter('filter')($scope.cards, {_id: !data._id})

   });


   $scope.gotoProject=function(){
     $state.go('project');
   }
   $scope.goToSprint=function(params,story){
     $state.go('sprint',params).then(function(){
       //$rootScope.showModal(story._id, listItem.group,listItem._id,listItem.listName);\
       console.log(story._id+"in then");
       angular.element("#"+story._id).triggerHandler("ng-click");
     })
   }
 }
}
])
.filter('applyFilter', function() {
 return function(cards, startDate,endDate) {
   return  cards.filter(function(card) {
     var parsedDate=moment(card.itemDate).utc().format('DD-MM-YYYY');
     console.log(startDate);
     console.log(parsedDate);
     if( parsedDate >= startDate && parsedDate <= endDate)
     {console.log("startDate:",startDate);
     console.log("parsedDate:",parsedDate);
     return(true);}
     return false;
   });
 }
});
