angular.module('frAgile')
    .controller('authController',function($scope,$http,$rootScope,$window,$location,$cookies){

    // redirect to login page if the user's isAuthenticated cookie doesn't exist
  //   if($cookies.get('login')==='true'){
  //     $window.location.href = '/home.html';
  // }

    $scope.logInErrorMsg = '';
    $scope.dismissMsg = function() {
      $rootScope.logInLogOutErrorMsg = '';
      $rootScope.logInLogOutSuccessMsg = '';
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
    $scope.passportLogin = function(){
      $http.post('/auth/login', $scope.user).success(function( loginData ){
//  console.log("here i am");
        if( loginData.error ){
        //  console.log(loginData.error);
          //$scope.logInErrorMsg = loginData.error;
          $scope.logInErrorMsg = "Invalid email or password";

        //  $cookies.remove('login');
           $window.location.href = '/index.html';
        } else{
          $scope.logInErrorMsg = "Sucessfully logged in";
        //  console.log("00000000000000000000000");
        //  $cookies.put('login',true);

          //console.log("================================"+$rootScope.isAuthenticatedCookie);
            $window.location.href = '/home.html';
        }
      });
    };

    $scope.register = function(){
      $http.post('/auth/register', $scope.user).success(function(data){
        console.log(data);
        if(data.state == 'success') {

          $window.location.href = '/index.html';
          $rootScope.logInLogOutSuccessMsg = 'Registered Sucessfully';
          $rootScope.logInLogOutErrorMsg = '';
        } else{

        $window.location.href = '/index.html';
        $rootScope.logInLogOutErrorMsg = 'Could not register you at the moment. Try after sometime.';
        $rootScope.logInLogOutSuccessMsg = '';
        }
      });
  };
});
