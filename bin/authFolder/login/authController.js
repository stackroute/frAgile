angular.module('Limber')
    .controller('authController',function($scope,$http,$rootScope,$window,$location){
      $scope.logInErrorMsg = '';
      $scope.passwordError='';
         $scope.dismissMsg = function() {
           $scope.registerErrorMsg = '';
           $scope.logInErrorMsg = '';
           $scope.passwordError='';
         }
         $scope.$watch('logInErrorMsg', function(nv,ov) {
     if (nv) {
       $('#errorDiv').slideDown();
     }else {
       $('#errorDiv').slideUp();
     }
   });
   $scope.$watch('registerErrorMsg', function(nv,ov) {
if (nv) {
 $('#regDiv').slideDown();
}else {
 $('#regDiv').slideUp();
}
});
   $scope.$watch('passwordError', function(nv,ov) {
   if (nv) {
    $('#passDiv').slideDown();
  //angular.element(element.getElementsById("#passDiv")).slideDown();
    }else {
    $('#passDiv').slideUp();
  //angular.element(element.getElementsById("#passDiv")).slideUp();
    }
    });
    $scope.user = {
      email:'',
      password:''
    };
    $scope.user1 = {
      email:'',
      password:'',
      confirmpassword:''
    };
    $scope.passportLogin = function(){
      console.log("In passportLogin");
      $http.post('/auth/login',$scope.user).success(function(data){
        console.log("user details",data);
        if(data.error) {
          $scope.logInErrorMsg = data.error;
          //$window.location.href = '/index.html';
        } else{
         $window.location.href = '/home.html';
         }
      });;
    }


    $scope.register = function(){
      if($scope.user1.password!=$scope.user1.confirmpassword){
         $scope.passwordError="Password does not match the confirm password";
      }
      else{
      $http.post('/auth/register', $scope.user1).success(function(data){
        console.log(data);
        if(data.error) {
          $scope.registerErrorMsg = data.error;
        // $window.location.href = '/index.html';
        } else
        {
         $window.location.href = '/home.html';
         }

      });
    }
  };
});
