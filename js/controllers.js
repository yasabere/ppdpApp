/*
**********************************************************************
Controllers for each page in application
*/

var ppdpControllers = angular.module('ppdpControllers', []);
 
ppdpControllers.controller('add_user', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('add user');
  }]
);

ppdpControllers.controller('assignment', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log();
  }]
);

ppdpControllers.controller('assignments', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('assignments');
  }]
);

ppdpControllers.controller('batch', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('batch');
  }]
);

ppdpControllers.controller('batches', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams, ppdpAPIService) {
    var batchModel = new ppdpAPIService.batchModel();

    $scope.batches = batchModel.retrieve({});;
    $scope.selected_batch = [];
    $scope.rows_selected = false;


    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');

    $scope.toggle_select = function(index){
      if ( $scope.selected_batch[index] == index){
        $scope.selected_batch.splice(index,1)
        console.log("deselect");
      }
      else{
        $scope.selected_batch[index] = index;
        console.log("select");
      }
      
    }

    $scope.details = function(){
      window.location = "batch.html";
    }
  }]
);

ppdpControllers.controller('create_newsclip', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('create_newsclip');
  }]
);

ppdpControllers.controller('files', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams, ppdpAPIService) {
    var fileModel = new ppdpAPIService.fileModel();

    $scope.files = fileModel.retrieve({});
    $scope.selected_files = [];
    $scope.rows_selected = false;

    $scope.directions = [];
    $scope.directions.push('Select file(s) to "Assign" or "Trash"');
    $scope.directions.push('Click file to download');

    $scope.toggle_select = function(index){
      if ( $scope.selected_files[index] == index){
        $scope.selected_files.splice(index,1)
        console.log("deselect");
      }
      else{
        $scope.selected_files[index] = index;
        console.log("select");
      }
      
    }

    $scope.details = function(){
      $('#downloadModal').modal('toggle');
    }
  }]
);

ppdpControllers.controller('footer', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('footer');
  }]
);

ppdpControllers.controller('header', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('header');
  }]
);

ppdpControllers.controller('home', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('home');
  }]
);

ppdpControllers.controller('login', ['$scope', '$routeParams', '$location', 'ppdpAPIService',
  function($scope, $routeParams) {
    $location.path('newclips');
  }]
);

ppdpControllers.controller('menu_sidebar', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, $ppdpAPIService, $location) {

    console.log($location);

    $scope.menu = [
      {
        title: 'Newsclips',
        href: 'newsclips',
        menu:[{
          title: 'Create',
          href: 'create_newsclip',
        }],
        path:'/'
      },
      {
        title: 'Batches',
        href: 'batches',
        menu:[]
      },
      {
        title: 'Files',
        href: 'files',
        menu:[{
          title: 'Upload',
          href: 'upload',
        }]
      },
      {
        title: 'Assignments',
        href: 'assignments',
      },
    ];

    $scope.menu.forEach(function(link) {
      console.log(link);
      if (link.title == $location.path() || link.path == $location.path()){
        link.class = 'active';
        console.log('found');
      }
    });

    console.log($scope.menu);

    console.log('menu_sidebar');
  }]
);

ppdpControllers.controller('newsclip', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('newsclip');
  }]
);

ppdpControllers.controller('newsclips', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('newsclips');
  }]
);

ppdpControllers.controller('sitemap', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('sitemap');
  }]
);

ppdpControllers.controller('user', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('user');
  }]
);

ppdpControllers.controller('users', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('users');
  }]
);
