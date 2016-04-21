angular.module('Limber')
    .controller('authController',function($scope,$http,$rootScope,$window,$location){
      $scope.logInErrorMsg = '';
         $scope.dismissMsg = function() {
           $rootScope.registerErrorMsg = '';
          // $rootScope.registerSuccessMsg = '';
           $scope.logInErrorMsg = '';
         }
         $scope.$watch('logInErrorMsg', function(nv,ov) {
     if (nv) {
       $('#errorDiv').slideDown();
     }else {
       $('#errorDiv').slideUp();
     }
   });
    $scope.user = {
      email:'',
      password:''
    };
    $scope.user1 = {
      email:'',
      password:''
    };
    $scope.passportLogin = function(){
      console.log("In passportLogin");
      $http.post('/auth/login', $scope.user).success(function(data){
        console.log(data);
        if(data.error) {
          $scope.logInErrorMsg = data.error;
          //$window.location.href = '/index.html';
        } else{
         $window.location.href = '/home.html';
         }
      });;
    }

    $scope.register = function(){
      $http.post('/auth/register', $scope.user1).success(function(data){
        console.log(data);
        if(data.error) {
          $scope.registerErrorMsg = data.error;
        // $window.location.href = '/index.html';
        } else{
         $window.location.href = '/home.html';
         }
      });
  };
});
