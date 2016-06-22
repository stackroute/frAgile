
angular.module('Limber')
     .config(function($routeProvider){
       $routeProvider
        .when('/',{
          'templateUrl' : 'index.html',
          'controller':'authController'
        })
        .when('/login', {
          'templateUrl': 'index.html',
          'controller':'authController'
        })
        });
