var angularModule = angular.module('LimberAuth',['ngRoute','ngCookies']);
console.log("In auth app3 what up?");

angularModule.config(function($routeProvider){
       $routeProvider
        .when('/',{
          'templateUrl' : 'login.html',
          'controller':'authController',
          resolve:{

             resourceBundle: function(ResourceBundle,$rootScope) {
       		 var data=ResourceBundle.retrieveResourceBundle();
       		 data.then(function() {
       		 	console.log("The data is resolve: $rootScope.resourceBundle: ",$rootScope.resourceBundle);
       		 	//console.log("The data is resolve-----: ",data);
       		 	return data;
       		 });
       		 console.log("I'm awaiting a response");
       		  //$rootScope.resourceBundle=data.$$stat;
       		 
      
            }
           
          }
        }).when('/forgot', {
          'templateUrl': 'forgot.html',
          'controller':'authController',
           resolve:{

             resourceBundle: function(ResourceBundle,$rootScope) {
       		 var data=ResourceBundle.retrieveResourceBundle();
       		 data.then(function() {
       		 	console.log("The data is resolve: $rootScope.resourceBundle: ",$rootScope.resourceBundle);
       		 	//console.log("The data is resolve-----: ",data);
       		 	return data;
       		 });
       		 console.log("I'm awaiting a response");
       		  //$rootScope.resourceBundle=data.$$stat;
       		 
      
            }
           
          }
          })
        });

