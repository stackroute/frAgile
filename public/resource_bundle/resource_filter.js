fragileApp.factory('Friend', function ($http) {
    return {
        get: function () {
            console.log("inside function");
            return $http.get('/resource_bundle/bundle.json');
        }
    };
});


fragileApp.filter('translate', ['$rootScope','Friend', function($rootScope,Friend) {
  $rootScope.currLang='en';
  var tables;
  Friend.get().then(function (msg) {
          tables= msg;
console.log(msg);
      });
console.log(tables);
  return function(label) {
    return tables[$rootScope.currLang][label];
  };

}])
