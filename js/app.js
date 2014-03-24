var ppdpApp = angular.module('ppdpApp', [
  'ngRoute',
  'ppdpControllers',
  'ppdpDirectives',
  'ppdpAPI',
  'angularFileUpload',
  'ngTagsInput'
]);

 /*
**********************************************************************
Handles url pattern
 */
ppdpApp.config(['$locationProvider',
    function($locationProvider) {
      $locationProvider.html5Mode(false);
      $locationProvider.hashPrefix('');
      //$location.absUrl() = 'http://pn.localhost/ppdp_app/#';
    }
  ]
);

 /*
**********************************************************************
Handles client-side application routing
 */
ppdpApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/newsclips.html',
        controller: 'newsclips'
      }).
      when('/add_user', {
        templateUrl: 'templates/user.html',
        controller: 'add_user'
      }).
      when('/assignments', {
        templateUrl: 'templates/assignments.html',
        controller: 'assignments'
      }).
      when('/batch/:batchId', {
        templateUrl: 'templates/batch.html',
        controller: 'batch'
      }).
      when('/batches', {
        templateUrl: 'templates/batches.html',
        controller: 'batches'
      }).
      when('/create_newsclip', {
        templateUrl: 'templates/create_newsclip.html',
        controller: 'create_newsclip'
      }).
      when('/files', {
        templateUrl: 'templates/files.html',
        controller: 'files'
      }).
       when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'login'
      }).
      when('/newsclip/:docId', {
        templateUrl: 'templates/newsclip.html',
        controller: 'newsclip'
      }).
      when('/newsclips', {
        templateUrl: 'templates/newsclips.html',
        controller: 'newsclips'
      }).
      when('/sitemap', {
        templateUrl: 'templates/sitemap.html',
        controller: 'sitemap'
      }).
      when('/upload_file', {
        templateUrl: 'templates/upload_file.html',
        controller: 'upload_file'
      }).
      when('/user/:userId', {
        templateUrl: 'templates/user.html',
        controller: 'user'
      }).
      when('/users', {
        templateUrl: 'templates/users.html',
        controller: 'users'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);



/*
**********************************************************************

 */
 ppdpApp.run(function ($rootScope, $location, ppdpAPIService) {
   $rootScope.user_account = 'undefined';
   
    //check if logged in
    ppdpAPIService.account.isloggedin().
      success(function(data,status){
        $rootScope.user_account = data;
      }).
      error(function(data,status){
        $location.path('login');
      });
      //if logged in store user data 
      //if not logged route user to login page
 });