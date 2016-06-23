
fragileApp.controller('cardsUIController', ['$scope', '$state','sprintService', '$rootScope', '$stateParams', '$uibModal','uibDateParser', 'cardsService', 'Socket', '$filter', 'graphModalFactory','homeService',function($scope, $state,sprintService, $rootScope, $stateParams, $uibModal,uibDateParser, cardsService, Socket, $filter, graphModalFactory,homeService) {
$scope.checklist=[1,2,3];

$scope.myDate;
console.log("hello",this.dueDate);
$scope.setDueDate=function(dueDate){
  console.log(dueDate);

$scope.myDate=new Date(dueDate);

}

  // $scope.myDate = new Date(this.myDate);
console.log($scope.myDate);
  //$scope.minDate = new Date()
  //     $scope.myDate.getFullYear(),
  //     $scope.myDate.getMonth() - 2,
  //     $scope.myDate.getDate();
  // $scope.maxDate = new Date(
  //     $scope.myDate.getFullYear(),
  //     $scope.myDate.getMonth() + 2,
  //     $scope.myDate.getDate());




console.log($scope);
}])
fragileApp.config(function($mdThemingProvider) {
  // $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
   $mdThemingProvider.theme('dark-green').backgroundPalette('green').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
   $mdThemingProvider.theme('light-blue').backgroundPalette('light-blue').dark();
});
