angular.module('fragileApp').factory('graphModalFactory', function($uibModal) {
  return {
    open: function(size,componentTemplate) {
      return $uibModal.open({
        animation: true,
        templateUrl: './components/graphModalWindow/graphModal.view.html',
        controller: 'graphModalController',
        size: size,
        resolve: {
          componentTemplate: function() {
            return componentTemplate;
          }
        }
      });
    }
  };
});

// angular.module('fragileApp').factory('graphModalFactory', function($uibModal) {
//   return {
//     open: function(size, template,subController, params) {
//       return $uibModal.open({
//         animation: true,
//         templateUrl: template,
//         controller: subController,
//         size: size,
//         resolve: {
//           params: function() {
//             return params;
//           }
//         }
//       });
//     }
//   };
// });
