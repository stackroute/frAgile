
angular.module('frAgile')
    .run(function($cookies,$rootScope,$http,$location,$window) {


      $rootScope.logInLogOutSuccessMsg = ''; // used on home.view.html page to display login/logout status msgs
      $rootScope.logInLogOutErrorMsg = '';

      $rootScope.serverErrorMsg = 'Error! Check your URL.';

      $rootScope.redirectTo = function( location ) {
       $location.path( "/" + location);
     };
    })
     .config(function($routeProvider){
       $routeProvider
        .when('/',{
          'templateUrl' : 'login/home.view.html',
          'controller':'authController'
        })
        .when('/login', {
          'templateUrl': 'login/home.view.html',
          'controller':'authController'
        })
        .when('/locallogin', {
          'templateUrl': 'login/localLogin.view.html',
          'controller': 'authController'
        })
        .when('/register', {
          'templateUrl': 'login/register.view.html',
          'controller': 'authController'
        })

    });
