angular.module('frAgile')
    .controller('authController',function($scope,$http,$rootScope,$window,$location,$cookies){



  //  $scope.logInErrorMsg = '';
    // $scope.dismissMsg = function() {
    //   $rootScope.logInLogOutErrorMsg = '';
    //   $rootScope.logInLogOutSuccessMsg = '';
    //   $scope.logInErrorMsg = '';
    // }
    // $scope.$watch('logInErrorMsg', function(nv,ov) {
    //   if (nv) {
    //     $('#errorDiv').slideDown();
    //   }else {
    //     $('#errorDiv').slideUp();
    //   }
    // });
    $scope.user = {
      email:'',
      password:''
    };
    $scope.passportLogin = function(){
      console.log("In passportLogin");
      $http.post('/auth/login', $scope.user).success(function(data){
        console.log(data);
        if(data.error) {

          $window.location.href = '/index.html';

        } else{

         $window.location.href = '/home.html';

         }
      });;
    }

    $scope.register = function(){
      $http.post('/auth/register', $scope.user).success(function(data){
        console.log(data);
        if(data.error) {

          $window.location.href = '/index.html';

        } else{

         $window.location.href = '/home.html';

         }
      });
  };
});
