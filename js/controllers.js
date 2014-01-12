/*
**********************************************************************
Controllers for each page in application
*/

var ppdpControllers = angular.module('ppdpControllers', []);

ppdpControllers.controller('add_user', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('add user');
    
    // TODO: -- need to implement fill in code
    
  }]
);

ppdpControllers.controller('assignment', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('newsclips');
   
    
  }]
);

ppdpControllers.controller('assignments', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    console.log('assignments');
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    var assignmentModel = new ppdpAPIService.assignmentModel();
    $scope.assignments = assignmentModel.retrieve({});
    $scope.selected_assignments = [];
    $scope.rows_selected = false;

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');

    /**
     * toggle_select() Update selected property of assignment and
     * updates selected_assienments based on id of batch passed in index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select = function(index){
      ppdpAPIService.toggle_select($scope.assignments,index);
      $scope.selected_assignments = ppdpAPIService.get_selected_subset($scope.assignments);
    }

    // FIXME: need to implement the angular way
    /**
     * details() redirect to assignment
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(){
      $location.path = "/assignment";
    }
    
    console.log($scope.assignments);
    
  }]
);

ppdpControllers.controller('batch', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('batch');
    
    // TODO: -- need to implement
    
  }]
);

ppdpControllers.controller('batches', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams, ppdpAPIService) {
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    var batchModel = new ppdpAPIService.batchModel();
    $scope.batches = batchModel.retrieve({});
    $scope.selected_batches = [];
    $scope.rows_selected = false;

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');

    /**
     * toggle_select() Update selected property of batch and
     * updates selected_batches based on id of batch passed in index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select = function(index){
      ppdpAPIService.toggle_select($scope.batches,index);
      $scope.selected_batches = ppdpAPIService.get_selected_subset($scope.batches);
    }

    // FIXME: need to implement the angular way
    /**
     * details() redirect to batch
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(){
      window.location = "batch.html";
    }
  }]
);

ppdpControllers.controller('create_newsclip', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('create_newsclip');
    
    // TODO: -- need to implement
    
  }]
);

ppdpControllers.controller('files', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams, ppdpAPIService) {
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    var fileModel = new ppdpAPIService.fileModel();
    $scope.files = fileModel.retrieve({});
    $scope.selected_files = [];
    $scope.rows_selected = false;

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select file(s) to "Assign" or "Trash"');
    $scope.directions.push('Click file to download');

    /**
     * toggle_select() Update selected property of file and
     * updates selected_files based on id of batch passed in index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select = function(index){
      ppdpAPIService.toggle_select($scope.files,index);
      $scope.selected_files = ppdpAPIService.get_selected_subset($scope.files);
    }

    // FIXME: need to implement the angular way
    /**
     * details() bring up file modal
     *
     * @param <String> index
     * @return NULL
     */
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

ppdpControllers.controller('home', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    console.log('home');
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    var documentModel = new ppdpAPIService.documentModel();
    $scope.documents = documentModel.retrieve({});
    $scope.selected_documents = [];
    $scope.rows_selected = false;

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');

    /**
     * toggle_select() Update selected property of batch and
     * updates selected_batches based on id of batch passed in index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select = function(index){
      ppdpAPIService.toggle_select($scope.documents,index);
      $scope.selected_documents = ppdpAPIService.get_selected_subset($scope.documents);
    }

    // FIXME: need to implement the angular way
    /**
     * details() redirect to batch
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(){
      $location.path = "/newsclip";
    }
    
    console.log($scope.documents);
    
  }]
);

ppdpControllers.controller('login', ['$scope', '$routeParams', '$location', 'ppdpAPIService',
  function($scope, $routeParams, $location, ppdpAPIService) {
    $location.path('newclips');
    
    // TODO: -- need to implementfill in code
    
  }]
);

ppdpControllers.controller('menu_sidebar', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {

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
        menu:[],
        path:'/batches'
      },
      {
        title: 'Files',
        href: 'files',
        menu:[{
          title: 'Upload',
          href: 'upload',
        }],
        path:'/files'
      },
      {
        title: 'Assignments',
        href: 'assignments',
        path:'/assignments',
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
    
    // TODO: -- need to implement
    
  }]
);

ppdpControllers.controller('newsclips', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    console.log('newsclips');
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    var documentModel = new ppdpAPIService.documentModel();
    $scope.documents = documentModel.retrieve({});
    $scope.selected_documents = [];
    $scope.rows_selected = false;

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');

    /**
     * toggle_select() Update selected property of batch and
     * updates selected_batches based on id of batch passed in index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select = function(index){
      ppdpAPIService.toggle_select($scope.documents,index);
      $scope.selected_documents = ppdpAPIService.get_selected_subset($scope.documents);
    }

    // FIXME: need to implement the angular way
    /**
     * details() redirect to batch
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(){
      $location.path = "/newsclip";
    }
    
    console.log($scope.documents);
    
  }]
);

ppdpControllers.controller('sitemap', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('sitemap');
    
    // TODO: -- need to implement
    
  }]
);

ppdpControllers.controller('user', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('user');
    
    // TODO: -- need to implement
    
  }]
);

ppdpControllers.controller('users', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('users');
    
    // TODO: -- need to implement fill in code copy batches
    
  }]
);
