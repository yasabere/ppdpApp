/*
**********************************************************************
Directives application
*/

var ppdpDirectives = angular.module('ppdpDirectives', []);

//directive for alerts
ppdpDirectives.directive('masterAlerts', function(ppdpAPIService){
   return {
     restrict: "E",
     templateUrl: "templates/alerts.html",
     scope: {
       alerts : '=alerts',
     },
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

//directive for header
ppdpDirectives.directive('masterHeader', function(ppdpAPIService){
  return {
    restrict: "E",
    templateUrl: "templates/header.html",
    scope: false,
    controller: 'header',
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

//directive for topmenu
ppdpDirectives.directive('masterTopMenu', function(ppdpAPIService){
   return {
     restrict: "E",
     templateUrl: "templates/topmenu.html",
     scope: {
       title : '=title',
       query : '=searchQuery',
       query_button_function : '=query_button_function',
       selected_data : '=selectedData',
       default_button_functions : '=defaultButtonFunctions',
       button_functions : '=buttonFunctions',
       back_function : '=backFunction',
       toggle_select_all_function :'=toggleSelectAllFunction',
       data: '=data',
       params: '=params',
       totalrows: '=totalRows',
       page_description: '=pageDescription'
     },
     controller: 'topmenu',
   } 
});

//directive for dropdown
ppdpDirectives.directive('dropdown', function(){
   return {
     restrict: "E",
     templateUrl: "templates/dropdown.html",
     scope: {
      ngModel : "=ngModel",
      options : "=options",
      extraOptions : "=extraOptions",
      placeholder : "=placeholder",
      text_field : "=textField",
      value_field : "=valueField"
     },
     controller:'dropdown',
     compile: function(element, attrs){
       if (!attrs.textField) { attrs.textField = 'text'; }
       if (!attrs.valueField) { attrs.valueField = 'value'; }
    },
   } 
});

//directive for autoSuggest
ppdpDirectives.directive('autoSuggest', function(){
   return {
     restrict: "E",
     templateUrl: "templates/autosuggest.html",
     scope: {
      model : "=ngModel",
      options : "=options",
      placeholder : "=placeholder",
      name_field : "=valueField"
     },
     controller:'autosuggest',
   } 
});



