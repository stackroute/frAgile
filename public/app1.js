
var fragileApp = angular.module('fragileApp',['angular.filter','xeditable','ui.router','ngLetterAvatar','ui.bootstrap','ngAnimate','ngDragDrop','autocomplete', 'angular-loading-bar','ngFileUpload','nvd3','jkuri.datepicker','ngMaterial', 'ngMessages', 'material.svgAssetsCache']);



fragileApp.filter('dateSuffix', function($filter) {
 var suffixes = ["th", "st", "nd", "rd"];
  return function(input) {
    if (!input || !input.length) { return; }

    var dtfilter = $filter('date')(input, 'MMMM d');
    var day = parseInt(dtfilter.slice(-2));
    var relevantDigits = (day < 30) ? day % 20 : day % 30;
    var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
    return dtfilter+suffix + ", " + $filter('date')(input, 'yyyy')
  };
});
