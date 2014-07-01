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
       tableRowSelect: '=tableRowSelect',
       loading: '=loading'
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
       page_description: '=pageDescription',
       show_paging: '=showPaging'
     },
     controller: 'topmenu',
     compile: function(element, attrs){
        if (!attrs.showPaging) { attrs.showPaging = 'true'; }
     }
   } 
});

ppdpDirectives.directive('pageNavigation', function(){
  return {
    restrict: "E",
     templateUrl: "templates/page_navigation.html",
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
       page_description: '=pageDescription',
       show_paging: '=showPaging'
     },
     controller: 'topmenu',
     compile: function(element, attrs){
        if (!attrs.showPaging) { attrs.showPaging = 'true'; }
     }
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
      description_field : "=descriptionField",
      value_field : "=valueField",
      returnObject: "=returnObject",
      search: "=search",
      disabled : "=disabled"
     },
     controller:'dropdown',
     
     compile: function(element, attrs){
       if (!attrs.textField) { attrs.textField = 'text'; }
       if (!attrs.valueField) { attrs.valueField = 'value'; }
       if (!attrs.descriptionField) { attrs.descriptionField = 'description'; }
       if (!attrs.search) { attrs.search = false; }
       if (!attrs.options) { attrs.options = []; }
    },
   } 
});

//directive for searchable dropdown
ppdpDirectives.directive('searchableDropdown', function(){
   return {
     restrict: "E",
     templateUrl: "templates/searchable_dropdown.html",
     scope: {
      ngModel : "=ngModel",
      options : "=options",
      extraOptions : "=extraOptions",
      placeholder : "=placeholder",
      text_field : "=textField",
      value_field : "=valueField",
      return_object: "=returnObject",
      query : "=query",
      disabled : "=disabled"
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
      name_field : "=valueField",
      returnObject: "=returnObject"
     },
     controller:'autosuggest',
   } 
});

//directive for calenderInput
ppdpDirectives.directive('calenderInput', function(){
   return {
     restrict: "E",
     templateUrl: "templates/calender_input.html",
     scope: {
      ngModel : "=ngModel",
      disabled : "=disabled"
     },
     link:function(scope, element, attrs, tabsCtrl) {
      var options = {
        ngModel: scope.ngModel
      }

      $(element[0].childNodes[0]).datetimepicker({
        pickTime: false
      });

      $(element[0].childNodes[0]).on('dp.change', function(ev) {

        scope.$apply(function() {
          scope.ngModel = $(element[0].childNodes[0].childNodes[1]).val();
        });

      });

    },
   } 
});

//directive which can ve used to neatly display code
ppdpDirectives.directive('ace', function(){
  return {
    restrict: "AE",
    scope: {
      ngModel : "=ngModel",
      nglang : "=lang",
     },
    link: function(scope, element, attrs, tabsCtrl){

      console.log(scope.autoSuggestCode);

      var innerText = element[0].innerHTML;
      var editor = ace.edit(element[0]);

      editor.setTheme("ace/theme/tomorrow");
      editor.getSession().setMode("ace/mode/"+scope.nglang);
      editor.setAutoScrollEditorIntoView(true);
      editor.setOption("maxLines", 100);
      editor.setReadOnly(true);
      if (scope.ngModel)
      editor.setValue(scope.ngModel, -1);
    }
  };
});



