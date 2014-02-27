/*
**********************************************************************
Controllers for each page in application
*/

var ppdpControllers = angular.module('ppdpControllers', []);

/** Controller: add_user */ 
ppdpControllers.controller('add_user', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('add user');
    
    // TODO: -- need to implement fill in code
    
  }]
);

/** Controller: assignment */ 
ppdpControllers.controller('assignment', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('newsclips');
    
    // TODO: -- need to implement fill in code
    
   
  }]
);

/** Controller: assignments */ 
ppdpControllers.controller('assignments', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    console.log('assignments');
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    var assignmentModel = new ppdpAPIService.assignmentModel();
    $scope.assignments = assignmentModel.retrieve({});
    $scope.selected_assignments = [];
    $scope.rows_selected = false;
    
    $scope.params = {
      offset:0,
      limit:5,
      query:''
    }

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');
    
    /** directive masterTopMenu data. 
     *  
     *  buttons to show up in menu
     * 
     */
    $scope.button_functions = [
      {
        text : 'Remove',
        glyphicon : 'trash',
        function_callback : function(){$('#deleteModal').modal('toggle')}, 
      }
    ];
    
    /** directive masterTable data. 
     *  
     *  text is text which shows up in table column header
     *  value is function which returns text which will show up table data under column. it excepts row parameter which data about document
     * 
     */
    $scope.columns = [
      {
        //header text to be shown for column
        text:'Name', 
        //row value 
        value: function(row){
          return row.type.name+" of "+row.file.name;
        },
        //function which is called when row is clicked
        click: function(id, row){
          $scope.details(id);
        },
        //attributes for rows
        attributes:[],
        //data field name
        field_text: 'name' 
      },
      { 
        text:'Assignee', 
        value: function(row){
          return row.user.first_name;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'test',
        field_text: 'user.first_name'
      },
      { 
        text:'Date Assigned',
        value: function(row){
          return row.date_created;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_created'
      },
      {
        text:'Date Due',
        value: function(row){
          return row.date_due;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_due'
      },
      {
        text:'Date Complete',
        value: function(row){
          return row.date_complete;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_complete'
      },
      {
        text:'Status',
        value: function(row){
          return row.status;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'status'
      },
    ];

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
      $location.path("/assignment");
    }
    
    console.log($scope.assignments);
    
  }]
);

/** Controller: autosuggest */ 
ppdpControllers.controller('autosuggest', ['$scope',
  function($scope) {

    console.log('autosuggest');
    
    $scope.select = function(option){
      if (option.name === undefined){
        $scope.model = option['$scope.name_field'];
      }
      else{
        $scope.model = option.name;
      }
    };
    
   
  }]
);

/** Controller: batch */ 
ppdpControllers.controller('batch', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('batch');
    
    // TODO: -- need to implement
    
  }]
);

/** Controller: batches */
ppdpControllers.controller('batches', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    var batchModel = new ppdpAPIService.batchModel();
    $scope.batches = batchModel.retrieve({});
    $scope.selected_batches = [];
    $scope.rows_selected = false;
    
    $scope.params = {
      offset:0,
      limit:5,
      query:''
    }

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');
    
    /** directive masterTopMenu data. 
     *  
     *  buttons to show up in menu
     * 
     */
    $scope.button_functions = [
      {
        text : 'Assign',
        glyphicon : 'folder-close',
        function_callback : function(){$('#batchModal').modal('toggle')}, 
      },
      {
        text : 'Publish',
        glyphicon : 'transfer',
        function_callback : function(){$('#publishModal').modal('toggle')}, 
      },
      {
        text : 'Remove',
        glyphicon : 'trash',
        function_callback : function(){$('#deleteModal').modal('toggle')}, 
      }
    ];
    
    /** directive masterTable data. 
     *  
     *  text is text which shows up in table column header
     *  value is function which returns text which will show up table data under column. it excepts row parameter which data about document
     * 
     */
    $scope.columns = [
      {
        //header text to be shown for column
        text:'Name', 
        //row value 
        value: function(row){
          return row.name;
        },
        //function which is called when row is clicked
        click: function(id, row){
          $scope.details(id);
        },
        //attributes for rows
        attributes:[],
        //data field name
        field_text: 'name' 
      },
      { 
        text:'Date Created', 
        value: function(row){
          return row.date_created;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'test',
        field_text: 'date_created'
      },
      { 
        text:'Creator',
        value: function(row){
          return row.entry_clerk.first_name;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'entry_clerk.first_name'
      },
      {
        text:'Status',
        value: function(row){
          return row.status;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'status'
      },
      {
        text:'Assigned',
        value: function(row){
          return (row.assigned)?'Unassigned':'Assigned';
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'assigned'
      }
    ];

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
      $location.path("batch.html");
    }
  }]
);

/** Controller: create_newsclip */
ppdpControllers.controller('create_newsclip', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    console.log('create_newsclip');
    
    //global variables
    $scope.saved = false;
    $scope.alerts = [];
    
    //news papers to be displayed in 'Newspaper' dropdown
    $scope.newspapers = ppdpAPIService.newspaper.retrieve({});
    
    //json representation of 
    $scope.doc = {
        abstract:'',
        comments:'',
        date:'',
        date_created: '',
        headline:'',
        policy:'',
        policy_code:'',
        type:'',
    };
    
    //query parameters
    $scope.params = {
      offset:0,
      limit:1,
      query:''
    }
    
    /**
     * back() redirect to users
     *
     * @param <String> index
     * @return NULL
     */
    $scope.back = function(){
      console.log("back");
      $location.path("/newsclips");
    }
    
    /**
     * save() updates current doc with doc data
     * id in url is based on passed index
     *
     * @return NULL
     */
    $scope.save = function(){
      console.log($scope.doc);
      
      $scope.alerts = [];
      
      if ($scope.create_doc_form.$invalid){
        $scope.alerts.push({
          message:'All fields with * must be filled in',
          level:'danger',  
        }); 
      }
      else{
        //call update api function
        ppdpAPIService.doc.create($scope.doc).
          success(function(data, status) {
            
            //set saved to true
            $scope.saved = true;
   
            //tell user that request was successful
            $scope.alerts.push({
              message:'Save successful!',
              level:'success',  
            }); 
            
            //add functions to topmenu
            $scope.button_functions = [
              {
                text : 'Add to Batch',
                glyphicon : 'folder-close',
                function_callback : function(){$('#batchModal').modal('toggle')}, 
              },
              {
                text : 'Remove',
                glyphicon : 'trash',
                function_callback : function(){$('#deleteModal').modal('toggle')}, 
              }
            ];
            
          }).
          error(function(data, status) {
            
            switch($scope.status){
              case 404:
                
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',  
                }); 
                
              break;
            }
        });
      }
    }
    
  }]
);

/** Controller: dropdown */ 
ppdpControllers.controller('dropdown', ['$scope',
  function($scope) {
    
    $scope.selected_value = $scope.placeholder;
    
    if ($scope.text_field === undefined || $scope.text_field === ''){
      $scope.text_field = 'text';
    }
    
    if ($scope.value_field === undefined || $scope.value_field === ''){
      $scope.value_field = 'value';
    }
    
    if ($scope.ngModel === ''){
      if ($scope.placeholder === undefined){
        $scope.selected_value = $scope.options[0][$scope.text_field];
        $scope.ngModel =  $scope.options[0][$scope.value_field];
      }
    }
  
    console.log('dropdown');
    
    $scope.select = function(option){
      $scope.selected_value = option[$scope.text_field];
      $scope.ngModel = option[$scope.value_field];
    };
    
   
  }]
);

/** Controller: files */
ppdpControllers.controller('files', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    $scope.files = [];
    $scope.selected_files = [];
    $scope.rows_selected = false;
    $scope.totalRows = 0;
    
    $scope.params = {
      offset:0,
      limit:5,
      query:''
    }

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select file(s) to "Assign" or "Trash"');
    $scope.directions.push('Click file to download');
    
    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      //call retrieve api function
      ppdpAPIService.file.retrieve($scope.params).
        success(function(data, status) {
          //load data into files
          $scope.files = data;
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
      
      //call retrieve api function get total num
      ppdpAPIService.file.totalNum($scope.params).
        success(function(data, status) {
  
          //load data into users
          $scope.totalRows = data.totalnum;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
    }
    
    $scope.update_results();

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
    
    /** directive masterTopMenu data. 
     *  
     *  buttons to show up in menu
     * 
     */
    $scope.button_functions = [
      {
        text : 'Assign',
        glyphicon : 'folder-close',
        function_callback : function(){$('#batchModal').modal('toggle')}, 
      },
      {
        text : 'Remove',
        glyphicon : 'trash',
        function_callback : function(){$('#deleteModal').modal('toggle')}, 
      }
    ];
    
    /** directive masterTable data. 
     *  
     *  text is text which shows up in table column header
     *  value is function which returns text which will show up table data under column. it excepts row parameter which data about document
     * 
     */
    $scope.columns = [
      {
        //header text to be shown for column
        text:'Name', 
        //row value 
        value: function(row){
          return row.name;
        },
        //function which is called when row is clicked
        click: function(id, row){
          $scope.details(id);
        },
        //attributes for rows
        attributes:[],
        //data field name
        field_text: 'name' 
      },
      { 
        text:'File Size', 
        value: function(row){
          return row.file_size;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'test',
        field_text: 'file_size'
      },
      { 
        text:'Creator',
        value: function(row){
          return row.entry_clerk.first_name;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'entry_clerk.first_name'
      },
      {
        text:'Date Created',
        value: function(row){
          return row.date_created;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_created'
      },
      {
        text:'Status',
        value: function(row){
          return row.status;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'status'
      },
      {
        text:'Assigned',
        value: function(row){
          return (row.assigned)?'Unassigned':'Assigned';
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'assigned'
      }
    ];

    // FIXME: need to implement the angular way
    /**
     * details() bring up file modal
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(option){
      $('#downloadModal').modal('toggle');
      $scope.downloadName = option.name;
    }
    
    /**
     * 'offset' change event
     * 
     * when params.offset changes page should change to newsclip with id equaling offset id
     * 
     */
    $scope.$watch('params', function() {
      
      console.log('shit changed');
      $scope.update_results();
      console.log($scope.params);
      return $scope.params;
    }, true); // initialize the watch
    
  }]
);

/** Controller: footer */
ppdpControllers.controller('footer', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('footer');
  }]
);

/** Controller: header */
ppdpControllers.controller('header', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('header');
  }]
);

/** Controller: home */
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
      $location.path("/newsclip");
    }
    
  }]
);

/** Controller: login */
ppdpControllers.controller('login', ['$scope', '$routeParams', '$location', 'ppdpAPIService',
  function($scope, $routeParams, $location, ppdpAPIService) {
    //$location.path('newclips');
    
    // TODO: -- need to implement
    
  }]
);

/** Controller: menu_sidebar */
ppdpControllers.controller('menu_sidebar', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {

    //json representation of menu sidebar
    $scope.menu = [
      {
        title: 'Newsclips',
        href: 'newsclips',
        menu:[{
          title: 'Create',
          href: 'create_newsclip',
          path:['/create_newsclip','/newsclip']
        }],
        path:['/','/newsclips','/newsclip/0']
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
          path:'/upload'
        }],
        path:'/files'
      },
      {
        title: 'Assignments',
        href: 'assignments',
        path:'/assignments',
        menu:[]
      },
      {
        title: 'Users',
        href: 'users',
        path:'/users',
        menu:[{
          title: 'Add User',
          href: 'create_user',
          path:['/create_user']
        }],
      },
    ];

    //determins if menu item has been selected and if so it adds 'active class'
    $scope.menu.forEach(function(link) {
      
      var has_link = false;
      
      //console.log(link.menu);
      link.menu.forEach(function(sub_link) {
        if (sub_link.title == $location.path() || sub_link.path == $location.path() || ( sub_link.path instanceof Array && $.inArray($location.path(),sub_link.path) != -1 ) ){
          has_link = true;
        }
      });

      if (link.title == $location.path() || ( link.path instanceof Array && $.inArray($location.path(),link.path) != -1 ) || link.path == $location.path() || has_link == true){
        link.class = 'active';
      }
      
    });

  }]
);

/** Controller: newsclip */
ppdpControllers.controller('newsclip', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$http',
  function($scope, $routeParams, ppdpAPIService, $location, $http) {
    console.log('newsclip');
    
    //global variables
    //document variable which represents the loaded document
    $scope.doc = {
        abstract:'',
        comments:'',
        date:'',
        date_created: '',
        headline:'',
        policy:'',
        policy_code:'',
        type:'',
    };
    
    //variable to keep track of recently searched documents for navigation 
    $scope.documents = [];
    
    //keep track of url variables
    $scope.old_params = jQuery.extend(true, {}, $routeParams);
    $scope.params = jQuery.extend(true, {}, $routeParams);
    jQuery.extend(true, $scope.params, {
      offset:parseInt($routeParams.docId),
      limit:1,
      query:''
    });
    
    // TODO: -- swap out for something that makes sense
    $scope.tiebreaker = false;
    
    //alerts to be displayed on screen
    $scope.alerts = [];
    
    //news papers to be displayed in 'Newspaper' dropdown
    $scope.newspapers = ppdpAPIService.newspaper.retrieve({});
    
    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Edit information');

    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      
      //retrieve a list of documents based off of what is in the uri parameters 
      ppdpAPIService.doc.retrieve({offset:0, limit:$routeParams.docId+1, query:$scope.old_params.query}).
        success(function(data, status) {

          $scope.documents = data;
          
          //get data for doc
          ppdpAPIService.doc.retrieve({id:data[$routeParams.docId].id}).
            success(function(data, status) {
              //load data into doc
              $scope.doc = jQuery.extend(true, {}, data[0]);
            }).
            error(function(data, status) {
              $scope.alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',
                debug_data:status+ ' : ' + data
              });
          });
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
      
      //call retrieve api function get total num
      ppdpAPIService.doc.totalNum({query:$routeParams.query}).
        success(function(data, status) {
  
          //load data into users
          $scope.totalRows = data.totalnum;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
    }
    
    $scope.update_results();

    /** directive masterTopMenu data. 
     *  
     *  buttons to show up in menu
     * 
     */
    $scope.button_functions = [
      {
        text : 'Add to Batch',
        glyphicon : 'folder-close',
        function_callback : function(){$('#batchModal').modal('toggle')}, 
      },
      {
        text : 'Remove',
        glyphicon : 'trash',
        function_callback : function(){$('#deleteModal').modal('toggle')}, 
      }
    ];
    
    /**
     * back() redirect to users
     *
     * @param <String> index
     * @return NULL
     */
    $scope.back = function(){
      console.log("back");
      $location.path("/newsclips").search($scope.old_params);
    }
    
    /**
     * save() updates current doc with doc data
     * id in url is based on passed index
     *
     * @return NULL
     */
    $scope.save = function(){
      $(".alert").alert('close');
      
      //remove all previous alerts
      $scope.alerts = [];
      
      //call update api function
      ppdpAPIService.doc.update($scope.doc).
        success(function(data, status) {
 
          //if succesful show message to user
          $scope.alerts.push({
            message:'Save successful!',
            level:'success',
          }); 
          
          console.log($scope.doc);
          
        }).
        error(function(data, status) {
          
          switch(status){
            
            case 403:
              
              $scope.alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',  
                debug_data: status+ ' : ' + data
              });
              
              break;
            
            case 404:
              
              $scope.alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',
                debug_data:status+ ' : ' + data
              });
              
              break;
              
            default:
            
              $scope.alerts.push({
                message:'Unknown problem.',
                level:'warning',
                debug_data:status+ ' : ' + data
              });
            
              break;
          }
      });
      
    }
    
    //events
    
    /**
     * 'offset' change event
     * 
     * when params.offset changes page should change to newsclip with id equaling offset id
     * 
     */
    $scope.$watch('params.offset', function() {
      //scope.greeting = scope.salutation + ' ' + scope.name + '!';
      if ($routeParams.docId != $scope.params.offset){
        var int = $scope.params.offset;
        var str = "/newsclip/"+$scope.params.offset;
        
        $location.path(str);
      }
      return $scope.params.offset;
    }); // initialize the watch
      
    
          
    // TODO: -- need to finish implementation
    
  }]
);

/** Controller: newsclips */
ppdpControllers.controller('newsclips', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    console.log('newsclips');
    
    // Global variables for controller
    $scope.documents = [];
    $scope.selected_documents = [];
    $scope.query = "";
    $scope.alerts = [];

    $scope.params = jQuery.extend(true, {}, $routeParams );
    jQuery.extend($scope.params, {
      offset:0,
      limit:5,
    });
    
    //$scope.num_items

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');
    
    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      //call retrieve api function
      ppdpAPIService.doc.retrieve($scope.params).
        success(function(data, status) {
          //load data into users
          $scope.documents = data;
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
      
      //call retrieve api function get total num
      ppdpAPIService.doc.totalNum($scope.params).
        success(function(data, status) {
  
          //load data into users
          $scope.totalRows = data.totalnum;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
    }
    
    $scope.update_results();
    
    /** directive masterTopMenu data. 
     *  
     *  buttons to show up in menu
     * 
     */
    $scope.button_functions = [
      {
        text : 'Add to Batch',
        glyphicon : 'folder-close',
        function_callback : function(){$('#batchModal').modal('toggle')}, 
      },
      {
        text : 'Remove',
        glyphicon : 'trash',
        function_callback : function(){$('#deleteModal').modal('toggle')}, 
      }
    ];
    
    
    /** directive masterTable data. 
     *  
     *  text is text which shows up in table column header
     *  value is function which returns text which will show up table data under column. it excepts row parameter which data about document
     * 
     */
    $scope.columns = [
      {
        //header text to be shown for column
        text:'Headline', 
        //row value 
        value: function(row){
          return row.headline;
        },
        //function which is called when row is clicked
        click: function(id, row){
          $scope.details(id);
        },
        //attributes for rows
        attributes:[],
        //data field name
        field_text: 'headline' 
      },
      { 
        text:'Newspaper', 
        value: function(row){
          return row.newspaper;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'test',
        field_text: 'newspaper'
      },
      { 
        text:'Date Created',
        value: function(row){
          return row.date_created;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_created'
      },
      {
        text:'Creator',
        value: function(row){
          return row.entry_clerk.first_name;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'entry_clerk.first_name'
      },
      {
        text:'Status',
        value: function(row){
          return row.status;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'status'
      },
      {
        text:'Assigned',
        value: function(row){
          return (row.assigned)?'Unassigned':'Assigned';
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'assigned'
      },
      {
        text:'ID',
        value: function(row){
          return row.id;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'id'
      }
    ];

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
    
    /**
     * toggle_select_all() Selects all documents
     *
     * @return NULL
     */
    $scope.toggle_select_all = function(){
      
      var i = 0;
      for(i = 0 ;i < $scope.documents.length; i+=1){
        ppdpAPIService.toggle_select($scope.documents,i);
        $scope.selected_documents = ppdpAPIService.get_selected_subset($scope.documents);
      }
      
    }
    
    // FIXME: need to implement the angular way
    /**
     * details() redirect to batch
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(id){
      console.log($scope.params);
      $location.path("/newsclip/"+(id+$scope.params.offset)).search($scope.params);
    }

    /**
     * 'params' change event
     * 
     * when params changes page should change to newsclip with id equaling offset id
     * This will also upate the query string
     * 
     */
    $scope.$watch('params', function() {
      
      console.log('shit changed');
      $scope.update_results();
      console.log($scope.params);
      return $scope.params;
    }, true); // initialize the watch
    
  }]
);

/** Controller: sitemap */
ppdpControllers.controller('sitemap', ['$scope', '$routeParams', 'ppdpAPIService',
  function($scope, $routeParams) {
    console.log('sitemap');
    
    // TODO: -- need to implement
    
  }]
);

/** Controller: table */
ppdpControllers.controller('table', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    
    console.log('table');
    
    //global veriabals
    $scope.predicate;
    $scope.reverse = false;
    $scope.arrow = ""
    
    /**
     * table_data_click_function() computes tableRowClick attribute
     * arg0 row index
     * arg1 row data
     * 
     * @param <String> arg0
     * @param <String> arg1
     * @return NULL
     */
    $scope.table_data_click_function = function(arg0, arg1){
      $scope.tableRowClick(arg0);
    }
    
    /**
     * table_data_select_function() computes tableRowSelect attribute
     * arg0 row index
     * arg1 row data
     * 
     * @param <String> arg0
     * @param <String> arg1
     * @return NULL
     */
    $scope.table_data_select_function = function(arg0, arg1){
      $scope.tableRowSelect(arg0, arg1);
    }
    
    /**
     * table_header_click_function() sets predicate for orderby
     * predicate string name of column field_text
     * 
     * @param <String> predicate
     * @return NULL
     */
    $scope.table_header_click_function = function(predicate){
      
      if ($scope.predicate == predicate){
        $scope.reverse = !$scope.reverse;
      }
      
      $scope.arrow = ($scope.reverse)?'▾':'▴';
      
      $scope.predicate = predicate;
    }
    
  }]
);

/** Controller: topmenu */
ppdpControllers.controller('topmenu', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    
    console.log('topmenu');
    
    $scope.displayed_limit = Math.min($scope.num_rows - 1,$scope.params.offset+$scope.params.limit);
    $scope.num_rows = parseInt(($scope.totalrows !== undefined) ? $scope.totalrows : $scope.data.length);

    /**
     * next_page() increment view of downcumets to next set
     *
     * @return NULL
     */
    $scope.next_page = function(){
      if ($scope.params.offset + $scope.params.limit < $scope.num_rows){
        $scope.params.offset = Math.min($scope.num_rows,$scope.params.offset+$scope.params.limit);
      }
      $scope.displayed_limit = Math.min($scope.num_rows ,$scope.params.offset+$scope.params.limit);
    };
    
    /**
     * previous_page() decrements view of downcumets to next set
     *
     * @return NULL
     */
    $scope.previous_page = function(){
      $scope.params.offset = Math.max(0,$scope.params.offset-$scope.params.limit);
      $scope.displayed_limit = Math.min($scope.num_rows ,$scope.params.offset+$scope.params.limit);
    };
    
    /**
     * 'data.length' change event
     * 
     * when params.offset changes page should change to newsclip with id equaling offset id
     * 
     */
    $scope.$watch('num_rows', function() {
      $scope.displayed_limit = Math.min($scope.num_rows ,$scope.params.offset+$scope.params.limit);
    }); // initialize the watch
    
    $scope.$watch('totalrows', function(){
      $scope.num_rows = parseInt(($scope.totalrows !== undefined) ? $scope.totalrows : $scope.data.length);
    });
    
  }]
);

/** Controller: user */
ppdpControllers.controller('user', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    console.log('user');
    
    //global variables
    $scope.alerts = [];
    
    $scope.user = {};
    $scope.users = [];
    $scope.roles = ppdpAPIService.role.retrieve({});
    
    //keep track of url variables
    $scope.old_params = jQuery.extend(true, {}, $routeParams);
    $scope.params = jQuery.extend(true, {}, $routeParams);
    jQuery.extend(true, $scope.params, {
      offset:parseInt($routeParams.userId),
      limit:1,
      query:''
    });
    
    //call retrieve api function
    ppdpAPIService.user.retrieve({offset:0, limit:$routeParams.userId+1, query:$scope.old_params.query}).
      success(function(data, status) {

        //load data into users
        $scope.users = data;
          
        //get data for doc
        ppdpAPIService.user.retrieve({id:$scope.users[$routeParams.userId].id}).
          success(function(data, status) {
            //load data into doc
            $scope.user = jQuery.extend(true, {}, data[0]);
          }).
          error(function(data, status) {
            $scope.alerts.push({
              message:'Trouble connecting to server.',
              level:'warning',
              debug_data:status+ ' : ' + data
            });
        });
        
      }).
      error(function(data, status) {
        $scope.alerts.push({
          message:'Trouble connecting to server.',
          level:'warning',
          debug_data:status+ ' : ' + data
        });
    });
    
    //call retrieve api function get total num
    ppdpAPIService.user.totalNum({query:$routeParams.query}).
      success(function(data, status) {

        //load data into users
        $scope.totalRows = data.totalnum;
        console.log($scope.totalRows);
        
      }).
      error(function(data, status) {
        $scope.alerts.push({
          message:'Trouble connecting to server.',
          level:'warning',
          debug_data:status+ ' : ' + data
        });
    });
    
    /** directive masterTopMenu data. 
     *  
     *  buttons to show up in menu
     * 
     */
    $scope.button_functions = [
      {
        text : 'Assign',
        glyphicon : 'folder-close',
        function_callback : function(){$('#assignModal').modal('toggle')}, 
      },
    ];
    
    /**
     * back() redirect to users
     *
     * @param <String> index
     * @return NULL
     */
    $scope.back = function(){
      console.log("back");
      $location.path("/users").search($scope.old_params);
    }
    
    $scope.save = function(){
      $(".alert").alert('close');
      
      //remove all previous alerts
      $scope.alerts = [];
      
      //call update api function
      if ($scope.create_user_form.$invalid){
        $scope.alerts.push({
          message:'All fields with * must be filled in',
          level:'danger',  
        }); 
      }
      else{
        ppdpAPIService.user.update($scope.user).
          success(function(data, status) {
   
            //if succesful show message to user
            $scope.alerts.push({
              message:'Save successful!',
              level:'success',  
            }); 
            
            console.log($scope.user);
            
          }).
          error(function(data, status) {
            
            switch(status){
              
              case 403:
                
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',  
                  debug_data: status+ ' : ' + data
                });
                
                break;
              
              case 404:
                
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',
                  debug_data:status+ ' : ' + data
                });
                
                break;
                
              default:
              
                $scope.alerts.push({
                  message:'Unknown problem.',
                  level:'warning',
                  debug_data:status+ ' : ' + data
                });
              
                break;
            }
        });
      }
      
      
      
    }
    
    $scope.$watch('params.offset', function() {
      //scope.greeting = scope.salutation + ' ' + scope.name + '!';
      if ($routeParams.docId != $scope.params.offset){
        var int = $scope.params.offset;
        var str = "/user/"+$scope.params.offset;
        
        $location.path(str);
      }
      return $scope.params.offset;
    }); // initialize the watch
  }]
);

/** Controller: users */
ppdpControllers.controller('users', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    console.log('users');
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    $scope.alerts = [];
    $scope.users = [];
    $scope.selected_users = [];
    $scope.rows_selected = false;
    
    $scope.params = jQuery.extend(true, {offset:0,limit:10}, $routeParams );

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');
    

    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      //call retrieve api function
      ppdpAPIService.user.retrieve($scope.params).
        success(function(data, status) {

          //load data into users
          $scope.users = data;
          
        
        }).
      error(function(data, status) {
        $scope.alerts.push({
          message:'Trouble connecting to server.',
          level:'warning',
          debug_data:status+ ' : ' + data
        });
      });
      
      //call retrieve api function get total num
      ppdpAPIService.user.totalNum($scope.params).
        success(function(data, status) {
  
          //load data into users
          $scope.totalRows = data.totalnum;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
        });
    }
    
    $scope.update_results();
    
    /** directive masterTopMenu data. 
     *  
     *  buttons to show up in menu
     * 
     */
    $scope.button_functions = [
      {
        text : 'Assign',
        glyphicon : 'folder-close',
        function_callback : function(){$('#assignModal').modal('toggle')}, 
      },
    ];
    
    /** directive masterTable data. 
     *  
     *  text is text which shows up in table column header
     *  value is function which returns text which will show up table data under column. it excepts row parameter which data about document
     * 
     */
    $scope.columns = [
      {
        //header text to be shown for column
        text:'Name', 
        //row value 
        value: function(row){
          return row.first_name + " " + row.last_name;
        },
        //function which is called when row is clicked
        click: function(id, row){
          $scope.details(id);
        },
        //attributes for rows
        attributes:[],
        //data field name
        field_text: 'first_name' 
      },
      { 
        text:'Date Joined',
        value: function(row){
          return row.date_joined;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_joined'
      },
      {
        text:'Role',
        value: function(row){
          return row.role.name;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'role.name'
      }
    ];

    /**
     * toggle_select() Update selected property of batch and
     * updates selected_batches based on id of batch passed in index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select = function(index){
      ppdpAPIService.toggle_select($scope.users,index);
      $scope.selected_users = ppdpAPIService.get_selected_subset($scope.users);
    }
    
    /**
     * toggle_select_all() Update selected property of batch and
     * updates all selected_batches
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select_all = function(){
      for (var i=0;i <6;i+=1){
          ppdpAPIService.toggle_select($scope.users,i);
      }
      
      $scope.selected_users = ppdpAPIService.get_selected_subset($scope.users);
    }

    /**
     * details() redirect to batch
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(id){
      $location.path("/user/"+id).search($scope.params);
    }
    
    /**
     * 'params' change event
     * 
     * when params changes page should change to newsclip with id equaling offset id
     * This will also upate the query string
     * 
     */
    $scope.$watch('params', function() {
      
      console.log('shit changed');
      $scope.update_results();
      console.log($scope.params);
      return $scope.params;
    }, true); // initialize the watch
    
  }]
);
