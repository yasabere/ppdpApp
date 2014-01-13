/*
**********************************************************************
Directives application
*/

var ppdpDirectives = angular.module('ppdpDirectives', []);

//directive for header
ppdpDirectives.directive('masterHeader', function(ppdpAPIService){
  return {
    restrict: "E",
    templateUrl: "templates/header.html",
    scope: false,
    controller: 'header',
  }
});

//directive for footer
ppdpDirectives.directive('masterFooter', function(ppdpAPIService){
  return {
    restrict: "E",
    templateUrl: "templates/footer.html",
    controller: 'footer',
  }
});

//directive for menu
ppdpDirectives.directive('masterMenu', function(ppdpAPIService){
  return {
    restrict: "E",
    templateUrl: "templates/sidebarmenu.html",
    controller: 'menu_sidebar',
  }
});