angular.module('Limber')
.filter('translate', ['$rootScope', function($rootScope) {
  $rootScope.currLang='hi';
  var tables = {
    'en': { 'Login': 'My Stories','Profile':'Profile','Integrate Github Account':'Integrate Github Account' },
    'nl': { 'My Stories': 'Log in','Profile':'Profiel','Integrate Github Account':'Integreer Github Account' },
    'hi':{'Login':'लॉग इन करें','Profile':'प्रोफाइल','Integrate Github Account':'एकीकृत Github अकाउंट'},
  };
  return function(label) {
    // tables is a nested map; by first selecting the
    // current language (kept in the $rootScope as a
    // global variable), and selecting the label,
    // we get the correct value.
    return tables[$rootScope.currLang][label];
  };

}])
