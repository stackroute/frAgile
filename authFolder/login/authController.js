angular.module('Limber')
    .controller('authController',function($scope,$http,$rootScope,$window,$location,$timeout){
      $scope.logInErrorMsg = '';
      $scope.passwordError='';
      $scope.passwordErrorMsg='';
      $rootScope.newUser={
      email:'',
      code:'',
      codeCheck:'',
      password:'',
      confirmpassword:'',
      verifyCheck:false,
      sendStatus:false
       };//this object is for forgot password
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
    

    $scope.forgotPassword=function()
    { 
      var code=Math.floor(Math.random()*90000) + 10000;
      $rootScope.newUser.code=code;
       console.log("user email client",$rootScope.newUser.email,$rootScope.newUser.code);


      $http.post('/auth/forgotpass',$rootScope.newUser).success(function(data)
      {         
          if(data.error){
              $scope.passwordErrorMsg=data.error;
              $timeout(function() {$scope.passwordErrorMsg=''}, 2000);
          }
          else{
            $rootScope.newUser.sendStatus=true;
            
            console.log("in else forgotPassword yooy",$rootScope.newUser);
          }

          //$timeout(function() {}, 2000);


      });
     // $window.location.href="/forgot.html";
    }//forgot password ends
    $scope.passwordUpdateMsg='';
    $scope.resetPassword=function(){
      if($rootScope.newUser.verifyCheck==false){
          if($rootScope.newUser.code==$rootScope.newUser.codeCheck){
            console.log(" verification done");
            $scope.passwordErrorMsg="Verified!"
            $timeout(function() {$scope.passwordErrorMsg=''; $rootScope.newUser.verifyCheck=true}, 2000);

          }else{
              console.log(" verification not done");
               $scope.passwordErrorMsg="Incorrect code. Try again..."
              $timeout(function() {$scope.passwordErrorMsg=''}, 2000);

          }
        }else if ($rootScope.newUser.verifyCheck==true){
            if($rootScope.newUser.password===$rootScope.newUser.confirmpassword){
                $http.post('/auth/resetPassword',$rootScope.newUser).success(function(data){
                if(data.error){
                   $scope.passwordUpdateMsg="Something went wrong. Try again";
                    $timeout(function() {$scope.passwordUpdateMsg='';}, 2000);

                } else{
                     $scope.passwordUpdateMsg="Password changed! Login again."
                      $timeout(function() {$scope.passwordUpdateMsg=''; $window.location.href = '/index.html';}, 2000);

                     }
                })


            }else{
               $scope.passwordUpdateMsg="Passwords doesn't match"
              $timeout(function() {$scope.passwordUpdateMsg='';}, 2000);

            }
        }
    }
    $scope.register = function(){
      if($scope.user1.password!=$scope.user1.confirmpassword){
         $scope.passwordError="Password does not match the confirm password";
      }
      else{
      $http.post('/auth/register', $scope.user1).success(function(data){
        console.log("in register uth");
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
