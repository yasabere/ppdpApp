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

//directive for table
ppdpDirectives.directive('masterTable', function(ppdpAPIService){
   return {
     restrict: "E",
     templateUrl: "templates/table.html",
     scope: {
       columns: '=columns',
       data: '=data',
       query: '=searchQuery',
       tableRowClick: '=tableRowClick',
       tableRowSelect: '=tableRowSelect'
     },
     controller: 'table',
   } 
});

//directive for table
ppdpDirectives.directive('masterTopMenu', function(ppdpAPIService){
   return {
     restrict: "E",
     templateUrl: "templates/topmenu.html",
     scope: {
       title : '=title',
       query : '=searchQuery',
       query_button_function : '=query_button_function',
       selected_data : '=selectedData',
       single_item : '=singleItem',
       default_button_functions : '=defaultButtonFunctions',
       button_functions : '=buttonFunctions',
       back : '=back',
       data: '=data'
     },
     controller: 'topmenu',
   } 
});



