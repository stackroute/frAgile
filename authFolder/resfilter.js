angular.module('Limber').filter('myFilter', ['$rootScope','$http', function($rootScope,$http) {
  // The code here executes only once, during initialization.
  // We'll return the actual filter function that's executed
  //many times.

  var tables = {
    'en': { 'APP_NAME':'Limber' ,
            'SINGUP_MSG':'Enter email and password to log on:',
            'TAG_LINE':'Manage your projects in a better way',
            'LOGIN_MSG':'Fill in the form below to get instant access:',
            'SIGNUP':'Sign up',
            'SIGNUP_BTN':'Sign me up!',
            'LOGIN':'Sign in',
            'SIGNIN_BTN':'Sign in!',
            'EMAIL' :'Email',
            'FORGOT_PASSWORD':'forgot password?'
          },
    'nl': { 'APP_NAME': 'limber:' }
  };

  // var mainResource={};
  //  $http.get('resource.json').success(function(data) {
  //       //mainResource=data;
  //       mainResource=data;
  //         console.log("the data inside ",mainResource[0].APP_NAME);

  //   });

  //console.log("the data is ",mainResource);
  $rootScope.currentLanguage = 'en';
  return function(label) {
    // tables is a nested map; by first selecting the
    // current language (kept in the $rootScope as a
    // global variable), and selecting the label,
    // we get the correct value.
    // console.log("The label name is: ",label);
    return tables[$rootScope.currentLanguage][label];
    return tables[label];
    //return mainResource[0].label;
  };
}]);