/*
**********************************************************************
Controllers for each page in application
*/

var ppdpControllers = angular.module('ppdpControllers', []);

/** Controller: add_user */ 
ppdpControllers.controller('add_user', ['$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($scope, $routeParams, ppdpAPIService, $location) {
    console.log('add user');

    //directions
    $scope.directions = [
      'Complete all fields',
      'Email must be a Temple University email and NOT be an alias',
      'Click “Save User” to complete'
      ];  
    
    //global variables
    $scope.alerts = [];
    $scope.state = 'create';
    $scope.saving = false;
    $scope.user = {};
    $scope.users = [];
    $scope.totalRows = 0;
    $scope.show_paging = false;
    
    //retrieve all roles
    ppdpAPIService.role.retrieve({}).
      success(function(data, status, headers, config){
        $scope.roles = data;
      }).
      error(function(data, status, headers, config){
        $scope.urgent_alerts.push({
          message:'Error connecting to server',
          level:'warning',
          debug_data: 'roles retrieve' + ' : ' + status+ ' : ' + data,
          config: config
        }); 
      });
    
    //keep track of url variables
    $scope.old_params = jQuery.extend(true, {}, $routeParams);
    $scope.params = jQuery.extend(true, {}, $routeParams);
    jQuery.extend(true, $scope.params, {
      offset:parseInt($routeParams.userId),
      limit:1,
      query:''
    });
    
    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
    
      //call retrieve api function
      ppdpAPIService.user.retrieve({offset:0, limit:$routeParams.userId+1, query:$scope.old_params.query}).
        success(function(data, status, headers, config) {
  
          //load data into users
          $scope.users = data;
            
          //get data for doc
          ppdpAPIService.user.retrieve({email:$scope.users[$routeParams.userId].email}).
            success(function(data, status, headers, config) {
              //load data into doc
              $scope.user = jQuery.extend(true, {}, data[$routeParams.userId]);
            }).
            error(function(data, status, headers, config) {
              $scope.alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',
                debug_data:'user retrieve' + ' : ' + status+ ' : ' + data,
                config: config
              });
            });
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:'user retrieve' + ' : ' + status+ ' : ' + data
          });
      });
      
      //call retrieve api function get total num
      ppdpAPIService.user.totalNum({offset:0,limit:100000,query:$routeParams.query}).
        success(function(data, status, headers, config) {
  
          //load data into users
          $scope.totalRows = data.total;
          console.log(data);
          console.log($scope.totalRows);
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: 'user retrieve totalnum' + ' : ' + status+ ' : ' + data,
            config: config
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
      $scope.saving = true;
      
      //remove all previous alerts
      $scope.alerts = [];
      
      console.log($scope.create_user_form);
      
      //call update api function
      if ($scope.create_user_form.$invalid){
        $scope.alerts.push({
          message:'All fields with * must be filled in',
          level:'danger',
        }); 
        
        $scope.saving = false;
      }
      else{
        ppdpAPIService.user.create($scope.user).
          success(function(data, status, headers, config) {
   
            //if succesful show message to user
            $scope.alerts.push({
              message:'Save successful!',
              level:'success',
              debug_data: $scope.user
            }); 
            
            $scope.state = 'update';
            
            console.log($scope.user);
            
            $scope.saving = false;
            
          }).
          error(function(data, status, headers, config) {
            $scope.saving = false;
            
            switch(status){
              
              case 403:
                
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',  
                  debug_data: status+ ' : ' + data,
                  config: config
                });
                
                break;
              
              case 404:
                
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',
                  debug_data: status+ ' : ' + data,
                  config: config
                });
                
                break;
                
              default:
              
                console.log($scope.user);
              
                $scope.alerts.push({
                  message:'Unknown problem.',
                  level:'warning',
                  debug_data:'user ' + $scope.state + ' : ' + status+ ' : ' + data
                });
              
                break;
            }
        });
      }
    };
   
  }]
);

/** Controller: assignments */ 
ppdpControllers.controller('assignments', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout', '$filter',
  function($scope, $routeParams, ppdpAPIService, $location, $timeout, $filter) {
    console.log('assignments');
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    $scope.assignments = [];
    $scope.selected_assignments = [];
    $scope.alerts = [];
    $scope.rows_selected = false;
    $scope.totalRows = 0;
    
    $scope.assignments_loading = true;
    
    $scope.params = {
      offset:0,
      limit:5,
      query:''
    }

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Click assignment to begin');
    
    /**
     * update_results() Updates assigment data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      
      $scope.assignments_loading = true;
      
      //call retrieve api function
      ppdpAPIService.assignment.retrieve($scope.params).
        success(function(data, status, headers, config) {

          //load data into assignments
          $scope.assignments = data;
          $scope.assignments_loading = false;
        
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
          $scope.assignments_loading = false;
          switch(status){
            case 401:
              $location.path('login');
            break;
          }
          
        });
      
      //call retrieve api function get total num
      ppdpAPIService.assignment.totalNum($scope.params).
        success(function(data, status, headers, config) {
  
          //load data into users
          $scope.totalRows = data.total;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
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
          
          //the value of the column which will be shown for each row
          var value;
          
          //depending on what type of assignment it is give the row a specific kind of title
          switch(row.type.id){
            case 1:
              //for dataentry of files
              value = "Data entry of "+row.file.name;
              
              break;
            case 2:
              //for coding of batches
              value = "Coding of batch "+row.batch.name;
              
              break;
            case 3:
              //for tiebreaking
              value = "Tiebreak of Newsclip "+row.document.id;
              
              break;
              
            default:
              value = 'unknown';
              break;
            
          }
          
          return value;
          
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
        text:'Assignees', 
        value: function(row){
          
          var string = "";
          
          for(var i = 0;i < row.users.length;i+=1){
            string += row.users[i].first_name + ((i < row.users.length - 1)?', ':'');
          }
          
          return string;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'test',
        field_text: 'users'
      },
      { 
        text:'Date Assigned',
        value: function(row){
         
          if (row.date_created){
            var date = new Date(row.date_created);
            date.setDate(date.getDate() + 1);
            return $filter('date')(date, "M/dd/yyyy");
          }
          else{
            return 'unspecified';
          }
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_added'
      },
      {
        text:'Date Due',
        value: function(row){
          var date = new Date(row.date_due);
          date.setDate(date.getDate() + 1);
          return $filter('date')(date, "M/dd/yyyy");
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
          
          if (row.date_complete){
            var date = new Date(row.date_complete);
            date.setDate(date.getDate() + 1);
            return $filter('date')(date, "M/dd/yyyy");
          }
          else{
            return 'unspecified';
          }
          
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
    
    /**
     * toggle_select_all() Update selected property of batch and
     * updates all selected_batches
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select_all = function(){
      var i = 0;
      for(i = 0 ;i < $scope.assignments.length; i+=1){
        ppdpAPIService.toggle_select($scope.assignments,i);
        $scope.selected_assignments = ppdpAPIService.get_selected_subset($scope.assignments);
      }
    }

    /**
     * details() redirect to assignment
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(id){
      //depending on what is clicked the user should be taken to different places
      switch($scope.assignments[id].type.id){
        case 1:
          //if the type is data entry bring up popup modal which allows them to download the files and start creating new documents
          //popup modal
          $('#downloadModal').modal('toggle');
          $scope.downloadName = $scope.assignments[id].file.name;
          $scope.downloadLink = $scope.assignments[id].file.href;
          break;
        case 2:
          //if the type is coding take user to the batch page so they can begin coding
          $location.path('batch/'+$scope.assignments[id].batch.id);
          break;
        case 3:
          //if the type is tiebraking take the user to the newsclip page
          $location.path('newsclip/'+$scope.assignments[id].document.id);
          break;
        default:
          //if the type is unrecognizable display an error
          $scope.alerts.push({
            message:'There was a problem on the server',
            level:'warning',
            config: config
          });
          break;
    
      }
    };
    
    /**
     * delete() deletes selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.delete = function(){
      for(var i = 0; i < $scope.selected_assignments.length; i+=1){
        ppdpAPIService.assignment.delete($scope.selected_assignments[i]);
        $scope.update_results();
      }
      $scope.selected_assignments =[];
      $('#deleteModal').modal('hide');
      
      //if succesful show message to user
      $scope.alerts.push({
        message:'Delete successful!',
        level:'success'
      }); 
      
      //after alert has been on screen for 2 seconds it is removed
      /*
      $timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);
      */
    }
    
    /**
     * 'params' change event
     * 
     * when params changes page should change to newsclip with id equaling offset id
     * This will also upate the query string
     * 
     */
    $scope.$watch('params', function() {
      
      $scope.update_results();
      return $scope.params;
    }, true); // initialize the watch
    
    /**
     * '$location.path' change event
     * 
     * hack to fix gray background on screen
     * 
     */
    $scope.create_newsclips_link = function() {
      
      $('#downloadModal').on('hidden.bs.modal', function (e) {
        $location.path("create_newsclip");
        $scope.$apply();
      })
      
      $('#downloadModal').modal('hide');
    }; 
    
  }]
);

/** Controller: autosuggest */ 
ppdpControllers.controller('autosuggest', ['$scope',
  function($scope) {

    console.log('autosuggest');
    
    $scope.select = function(option){
      if ($scope.returnObject === 'true'){
        $scope.model = option;
      }
      else{
        if (option.name === undefined){
          $scope.model = option['$scope.name_field'];
        }
        else{
          $scope.model = option.name;
        }
      }
    };
    
   
  }]
);

/** Controller: batch */
ppdpControllers.controller('batch', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout', '$rootScope', '$filter',
  function($scope, $routeParams, ppdpAPIService, $location, $timeout, $rootScope, $filter) {
    console.log('batch');
    
    // Global variables for controller
    
    //batch to be shown on screen
    $scope.batch = {};
    $scope.batches_loading = true;
    
    //newsclips to be shown in table
    $scope.documents = [];
    
    //batches to be shown in dropdown when adding to batch
    $scope.batches = [];
    
    //documents which bave been check boxed
    $scope.selected_documents = [];
    
    //alerts to be shown on screen
    $scope.alerts = [];
    
    //page title to show up in top menu
    $scope.title = "";
    
    //handle url parameters from previous page
    $scope.params = jQuery.extend(true, {offset:0,limit:5}, $routeParams );
    $scope.params.offset = parseInt($scope.params.offset);
    $scope.params.limit = parseInt($scope.params.limit);
    console.log($scope.params);
    $scope.batches_loading = true;
    
    //call retrieve api function
    ppdpAPIService.batch.retrieve({id:$routeParams.batch_id}).
      success(function(data, status, headers, config) {
        
        //load data into batch
        $scope.batch = data;
        $scope.title = "Batch " + $scope.batch.id + ' |';
        
      }).
      error(function(data, status, headers, config) {
        $scope.alerts.push({
          message:'Trouble connecting to server. Could not retrieve batch data',
          level:'warning',
          debug_data: status+ ' : ' + data,
          config: config
        });
    });
    
    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');
    
    /**
     * update_batches() Updates batches to be shown when batch
     *
     * @return NULL
     */
    $scope.update_batches = function(){
      //call retrieve api function
      ppdpAPIService.batch.retrieve({}).
        success(function(data, status, headers, config) {
          //load data into batch
          $scope.batches = data;
          
          for(var i = 0; i < batches.length; i+=1 ){
            batches[i].year = $filter('date')(new Date(row.date_added), "yyyy")
          }
          
          $('.selectpicker').selectpicker({
            'selectedText': 'cat'
          });
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
          /*$('.selectpicker').selectpicker({
            'selectedText': 'cat'
          });*/
      });
    };
    
    $scope.update_batches();
    
    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      
      $scope.batches_loading = true;
      
      //call retrieve api function
      ppdpAPIService.doc.retrieve($scope.params).
        success(function(data, status, headers, config) {
          //load data into users
          $scope.documents = data;
          $scope.batches_loading = false;
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server. Could not retrieve newsclips.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
          $scope.batches_loading = false;
      });
      
      //call retrieve api function get total num
      ppdpAPIService.doc.totalNum($scope.params).
        success(function(data, status, headers, config) {
  
          //load data into users
          $scope.totalRows = data.total;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server. Could not retrieve newsclips stat data.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
    };
    
    $scope.update_results();
    
    /** directive masterTopMenu data. 
     *  
     *  buttons to show up in menu
     * 
     */
    $scope.button_functions = [];

    //if user has role greater than researcher
    if($rootScope.user_account.role.id >= 2){
      $scope.button_functions.push({
        text : 'Remove from Batch',
        glyphicon : 'folder-close',
        function_callback : function(){$('#removeModal').modal('toggle')}, 
      });

      $scope.button_functions.push({
        text : 'Remove',
        glyphicon : 'trash',
        function_callback : function(){$('#deleteModal').modal('toggle')}, 
      });
    }
  
    
    
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
   
          return (row.headline == 'NULL')?'[Not Applicable]':row.headline;
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

          var date = new Date(row.date_added);
          date.setDate(date.getDate() + 1);
          return $filter('date')(date, "M/dd/yyyy");
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_added'
      },
      {
        text:'Creator',
        value: function(row){
          return row.creator.first_name;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'creator.first_name'
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
          return (row.assigned)?'Assigned':'Unassigned';
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
          return parseInt(row.id);
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
    };
    
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
      
    };
    
    // FIXME: need to implement the angular way
    /**
     * details() redirect to batch
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(id){
      $location.path("/newsclip/"+(id+$scope.params.offset)).search($scope.params);
    };
    
    /**
     * delete() deletes selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.delete = function(){
      for(var i = 0; i < $scope.selected_documents.length; i+=1){
        ppdpAPIService.doc.delete($scope.selected_documents[i]);
        $scope.update_results();
      }
      $scope.selected_documents = [];
      $('#deleteModal').modal('hide');
      
      //if succesful show message to user
      $scope.alerts.push({
        message:'Delete successful!',
        level:'success'
      }); 
      
      //after alert has been on screen for 2 seconds it is removed
      $timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);
    };
    
    /**
     * removeFromBatch() remove selected items from batch
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.removeFromBatch = function(){
      for(var i = 0; i < $scope.selected_documents.length; i+=1){
        ppdpAPIService.batch.removedocument({doc_id:$scope.selected_documents[i].id, batch_id:$scope.batch.id}).
          success(function(){
            
          }).
          error(function(data, status, headers, config) {
            $scope.alerts.push({
              message:'Trouble connecting to server.',
              level:'warning',
              debug_data: status+ ' : ' + data,
              config: config
            });
          });
        
        $scope.update_results();
      }
      $scope.selected_documents = [];
      $('#removeModal').modal('hide');
      
      //if succesful show message to user
      $scope.alerts.push({
        message:'Removal successful!',
        level:'success'
      }); 
      
      //after alert has been on screen for 2 seconds it is removed
      /*
      $timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);
      */
    };

    /**
     * 'params' change event
     * 
     * when params changes page should change to newsclip with id equaling offset id
     * This will also upate the query string
     * 
     */
    $scope.$watch('params', function() {
      $scope.update_results();
      return $scope.params;
    }, true); // initialize the watch
    
    $scope.$watch('selected_batch', function() {
      
      if ($scope.selected_batch){
        $('.selectpicker').selectpicker('render');
      }
      
      
    });

    $('#batchModal').on('show.bs.modal', function (e) {
      $('.selectpicker').selectpicker('render');
    });
  }]
);

/** Controller: batches */
ppdpControllers.controller('batches', ['$rootScope', '$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout', '$filter',
  function($rootScope, $scope, $routeParams, ppdpAPIService, $location, $timeout, $filter) {
    
    // Global variables for controller
    $scope.batches = [];
    $scope.batches_loading = true;
    $scope.assigning = false;
    $scope.deleting = false;
    
    $scope.users = [];
    $scope.selected_batches = [];
    $scope.alerts = [];
    $scope.create_batch_alerts = [];
    $scope.assign_alerts = [];
    $scope.rows_selected = false;
    $scope.totalRows = 0;
    $scope.assignment = {type:{name:'Code', id:2},users:[]};
    $scope.new_batch_object = {name:''}
    
    $scope.params = {
      offset:0,
      limit:5,
      query:''
    }

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click on an individual Batch to view the Newsclips contained');
    
    /**
     * update_results() Updates batch data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      $scope.batches_loading = true;
      
      //call retrieve api function
      ppdpAPIService.batch.retrieve($scope.params).
        success(function(data, status, headers, config) {

          //load data into users
          $scope.batches = data;
          $scope.batches_loading = false;
        
        }).
        error(function(data, status, headers, config) {
          $scope.batches_loading = false;
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
        });
      
      //call retrieve api function get total num
      ppdpAPIService.batch.totalNum($scope.params).
        success(function(data, status, headers, config) {
  
          //load data into users
          $scope.totalRows = data.total;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
        });
    }
    
    $scope.update_results();
    
    /**
     * update_batches() Updates batches to be shown when batch
     *
     * @return NULL
     */
    $scope.update_users = function(){
      //call retrieve api function
      ppdpAPIService.user.retrieve({}).
        success(function(data, status, headers, config) {
          //load data into batch
          
          for(var i = 0;i < data.length; i+=1){
            $scope.users.push({first_name:data[i].first_name, last_name:data[i].last_name, name:data[i].first_name + ' ' + data[i].last_name, id:data[i].id,email:data[i].email});
          }
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
    }
    
    $scope.update_users();
    
    //if the user has the authority
    if($rootScope.user_account.role.id >= 2){
    
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
        //{
        //  text : 'Publish',
        //  glyphicon : 'transfer',
        //  function_callback : function(){$('#publishModal').modal('toggle')}, 
        //},
        {
          text : 'Remove',
          glyphicon : 'trash',
          function_callback : function(){$('#deleteModal').modal('toggle')}, 
        }
      ];
    
    }
    
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
            var date = new Date(row.date_created);
            date.setDate(date.getDate() + 1);
            return $filter('date')(date, "M/dd/yyyy");
          },
          click: function(id, row){
            $scope.details(id);
          },
          attributes:'test',
          field_text: 'date_added'
        },
        { 
          text:'Creator',
          value: function(row){
            return row.creator.first_name;
          },
          click: function(id, row){
            $scope.details(id);
          },
          attributes:'',
          field_text: 'creator.first_name'
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
            return (row.assigned)?'Assigned':'Unassigned';
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
    
    /**
     * toggle_select_all() Update selected property of batch and
     * updates all selected_batches
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select_all = function(){
      var i = 0;
      for(i = 0 ;i < $scope.batches.length; i+=1){
        ppdpAPIService.toggle_select($scope.batches,i);
        $scope.selected_batches = ppdpAPIService.get_selected_subset($scope.batches);
      }
    }

    /**
     * details() redirect to batch
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(id){
      $location.path("/batch/"+($scope.batches[id].id)).search($scope.params);
    };
    
    /**
     * delete() deletes selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.delete = function(){
      
      $scope.deleting = true;
      
      var num = 0;
      
      for(var i = 0; i < $scope.selected_batches.length; i+=1){
        ppdpAPIService.batch.delete($scope.selected_batches[i]).
          success(function(data, status, headers, config) {
            $scope.update_results();

            num+=1;

            if (num == $scope.selected_batches.length){
              
              $scope.deleting = false;
              
              //if succesful show message to user
              $scope.alerts.push({
                message:'Delete successful!',
                level:'success'
              }); 
              
              $('#deleteModal').modal('hide');
              $scope.selected_batches = [];
              
              //after alert has been on screen for 2 seconds it is removed
              /*$timeout(function(){
                $('.alert').bind('closed.bs.alert', function () {
                  $scope.alerts = [];
                });
                $(".alert").alert('close');
              }, 2000);*/ 
            }

          }).
          error(function(data, status, headers, config) {
            
            $scope.deleting = false;
            
            $scope.alerts.push({
              message:'Trouble connecting to server. Batch "'+$scope.selected_batches[i].name +'" could not be deleted',
              level:'warning',
              debug_data: status+ ' : ' + data,
              config: config
            });
          });
      }
      
      //after alert has been on screen for 2 seconds it is removed
      $timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);
    };
    
    /**
     * assign() creates new assignment
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.assign = function(){
      
      //show user that the server is processing the assignment creation
      $scope.assigning = true;
      var num = 0;
      
      $scope.assign_alerts = [];
      $scope.alerts = [];
      
      //validate form
      var user_selected = false;
      var error_found = false;
      
      //check if type selected
      if ($scope.assignment.type === '' ){
        $scope.assign_alerts.push({
          message:'Task must be selected',
          level:'danger',
        });
        
        error_found = true;
      }
      
      //check if user selected
      for(var j = 0 ; j < $scope.users.length; j+=1){
        
        if ($scope.users[j].selected){
          user_selected = true;
        }
        
      }
      if (!user_selected){
        $scope.assign_alerts.push({
          message:'one or assignees must be checked',
          level:'danger',
        });
        
        error_found = true;
      }
      
      //if false tell user
      if (error_found === true){
        $scope.assigning = false;
        return false;
      }
      
      //for each selected batch create the new assignment
      for(var i = 0; i < $scope.selected_batches.length; i+=1){

        $scope.assignment.batch = $scope.selected_batches[i];
        
        //create new request object to be sent to api
        var assignment_request = jQuery.extend( true, {},$scope.assignment);
        
        //add each selected user to the request
        for(var j = 0 ; j < $scope.users.length; j+=1){
          
          if ($scope.users[j].selected){
            assignment_request.users.push($scope.users[j]);
          }
          
        }

        //call create assignment api function and pass the assignment request object
        ppdpAPIService.assignment.create(assignment_request).
          success(function(){
            
            //count the number of batches assigned
            num += 1;
            
            if (num == $scope.selected_batches.length){
            
              //tell user that the loading process is completed
              $scope.assigning = false;
              
              //set all batches to non selected
              $scope.selected_batches = [];
              
              //show user that the assignment has been created
              $scope.alerts.push({
                message:'Assignment created!',
                level:'success'
              });
              
              //close modal
              $('#assignModal').modal('hide');
              
              //refresh results after assignment is completed in case they chaned
              $scope.update_results();
            
            }
            
          }).
          error(function(data, status, headers, config) {
          
            //show user that there was an error
            $scope.alerts.push({
              message:'Trouble connecting to server.',
              level:'warning',
              debug_data: status+ ' : ' + data,
              config: config
            });
            
            //show user that the loading process has been completed
            $scope.assigning = false;
            
          });
        
      }
      
      //after alert has been on screen for 2 seconds it is removed
      /*$timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);*/
    };
    
    /**
     * create() creates selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.create = function(){
   
      //validate new batch object and tell user if there was a user error
      if($scope.new_batch_object.name !== ''){
        
        //try to create batch
        ppdpAPIService.batch.create($scope.new_batch_object).
          success(function(data, status, headers, config){
            
            $scope.update_results();
            $('#createBatchModal').modal('hide');
            
            //if succesful show message to user
            $scope.alerts.push({
              message:'New batch successfully created',
              level:'success'
            });
            
            //after alert has been on screen for 2 seconds it is removed
            $timeout(function(){
              $('.alert').bind('closed.bs.alert', function () {
                $scope.alerts = [];
              });
              $(".alert").alert('close');
            }, 2000);
            
            //reset $scope.new_batch_object
            $scope.new_batch_object = {};
                
          }).
          error(function(data, status, headers, config){
            
            //if failure show user on create batch screen
            $scope.alerts.push({
              message:'Batch could not be created',
              level:'danger',
              debug_data: status+ ' : ' + data,
              config: config
            });
            
          });
          
      }
      else{
        
        $scope.create_batch_alerts = [];
        
        //alert user that there is a user error
        $scope.create_batch_alerts.push({
          message:'Please enter a batch name',
          level:'danger'
        });
      }
      
    };
    
    /**
     * 'params' change event
     * 
     * when params changes page should change to newsclip with id equaling offset id
     * This will also upate the query string
     * 
     */
    $scope.$watch('params', function() {
      $scope.update_results();
      return $scope.params;
    }, true); // initialize the watch
  }]
);

/** Controller: create_newsclip */
ppdpControllers.controller('create_newsclip', ['$rootScope','$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout',
  function($rootScope,$scope, $routeParams, ppdpAPIService, $location, $timeout) {
    console.log('create_newsclip');
    
    //directions
    $scope.directions = [
      'Complete all fields',
      'The Newspaper field can autocomplete and has the option to enter new values',
      'Date can be entered manually or with the popover module',
      'Comments are optional',
      '"View Code Book" is a link that opens the code book in a new tab'
    ];

    //global variables
    $scope.saved = false;
    $scope.alerts = [];
    $scope.urgent_alerts = [];
    $scope.state = 'create';
    $scope.policy_codes = [];
    $scope.types = [];
    $scope.saving = false;
    $scope.adding_documents_to_batch = false;
    
    //news papers to be displayed in 'Newspaper' dropdown
    ppdpAPIService.newspaper.retrieve({}).
      success(function(data, status, headers, config){
        $scope.newspapers = data;
      }).
      error(function(data, status, headers, config){
        $scope.urgent_alerts.push({
          message:'Error connecting to server',
          level:'warning',
          debug_data: status+ ' : ' + data,
          config: config
        }); 
      });
      
    //policycodes to be displayed in 'code' dropdown
    ppdpAPIService.code.retrieve({}).
      success(function(data, status, headers, config){
        $scope.policy_codes = data;
      }).
      error(function(data, status, headers, config){
        $scope.urgent_alerts.push({
          message:'Error connecting to server',
          level:'warning',
          debug_data: status+ ' : ' + data,
          config: config
        }); 
      });
      
    //type to be displayed in 'Types' dropdown
    ppdpAPIService.newsclipType.retrieve({}).
      success(function(data, status, headers, config){
        $scope.types = data;
      }).
      error(function(data, status, headers, config){
        $scope.urgent_alerts.push({
          message:'Error connecting to server',
          level:'warning',
          debug_data: status+ ' : ' + data,
          config: config
        }); 
      });
    
    //json representation of 
    $scope.doc = {};
    
    //query parameters
    $scope.params = {
      offset:0,
      limit:1,
      query:''
    };
    
    /**
     * back() redirect to users
     *
     * @param <String> index
     * @return NULL
     */
    $scope.back = function(){
      console.log("back");
      $location.path("/newsclips");
    };
    
    /**
     * save() updates current doc with doc data
     * id in url is based on passed index
     *
     * @return NULL
     */
    $scope.save = function(){
      console.log($scope.doc);
      $scope.saving = true;
      
      $scope.alerts = [];
      
      if ($scope.create_doc_form.$invalid){
        $scope.saving = false;
        $scope.alerts.push({
          message:'All fields with * must be filled in',
          level:'danger',  
        }); 
      }
      else{
        //call update api function
        ppdpAPIService.doc[$scope.state]($scope.doc).
          success(function(data, status, headers, config) {
            
            //set saved to true
            $scope.saved = true;
            $scope.saving = false;
            
            //tell user that request was successful
            $scope.alerts.push({
              message:'Save successful!',
              level:'success',  
            }); 
            
            if ($scope.state == 'create'){
            
              //update created document
              $scope.doc = jQuery.extend(true, {}, doc_data);
              $scope.doc.date_time = $filter('date')(new Date($scope.doc.date_time), "M/dd/yyyy");
     
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
            }
            
            $scope.state = 'update';
            
          }).
          error(function(data, status, headers, config) {
            
            $scope.saving = false;
            switch($scope.status){
              default:
                
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',
                  debug_data: status+ ' : ' + data,
                  config: config  
                }); 
                
              break;
            }
        });
      }
    }
    
    /**
     * delete() deletes selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.delete = function(){
      //call update api function
      ppdpAPIService.doc.delete($scope.doc).
        success(function(data, status, headers, config) {
 
          //if succesful show message to user
          $scope.urgent_alerts.push({
            message:'Delete successful!',
            level:'success',
          }); 
          
          $('#deleteModal').modal('hide');
          
          $timeout(function(){
            $location.path("/newsclips");
            $scope.$apply();
          }, 1000);
          
        }).
        error(function(data, status, headers, config) {
          
          switch(status){
            
            case 403:
              
              $scope.urgent_alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',  
                debug_data: status+ ' : ' + data,
                config: config
              });
              
              break;
            
            case 404:
              
              $scope.urgent_alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',
                debug_data: status+ ' : ' + data,
                config: config
              });
              
              break;
              
            default:
            
              $scope.urgent_alerts.push({
                message:'Unknown problem.',
                level:'warning',
                debug_data: status+ ' : ' + data,
                config: config
              });
            
              break;
          }
      });
    };
    
    /**
     * add_to_batch() Adds document to bach
     * 
     * @param NULL
     * @return NULL
     * 
     */
    $scope.add_to_batch = function(){
      
      $scope.adding_documents_to_batch = true;
      
      ppdpAPIService.batch.adddocument({doc_id:$scope.doc.id, batch_id:$scope.selected_batch.id}).
        success(function(data, status){

          $('#batchModal').modal('hide');
  
          //if succesful show message to user
          $scope.alerts.push({
            message: 'Document was successfully added to the batch',
            level:'success'
          });
          
          $scope.adding_documents_to_batch = false;
          
          $scope.selected_documents = [];
        
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
          
          $scope.adding_documents_to_batch = false;
        });
        
    };
		
		//jquery
		$('#date_time').datetimepicker({
			pickTime: false
		});
    
    $('.selectpicker').selectpicker({
        'selectedText': 'cat'
    });
    
  }]
);

/** controller: develop */
ppdpControllers.controller('develop', ['$scope', 'ppdpAPIService',
  function($scope, ppdpAPIService) {

    console.log(ppdpAPIService);

    $scope.booleanOptions = [
    {
      text: 'True',
      value: true
    },
    {
      text: 'False',
      value: false
    }];

    $scope.dropdownCode = "<dropdown\n"
    +"\tng-Model = \"modelValue\"\n"
    +"\toptions = \"options\"\n"
    +"\ttext-Field = \" 'text' \"\n" 
    +"\tvalue-Field = \" 'value' \"\n"
    +"\tdescription-Field = \" 'description' \"\n"
    +"\tplaceholder = \" 'Select a type' \"\n"
    +"\textraOptions = \" 'extraOptions' \"\n"
    +"\treturnObject = \" 'returnObject' \"\n"
    +"\tsearch = \" 'search' \"\n"
    +"\tdisabled = \" 'disabled' \"\n"
    +"\t>\n"
    +"</dropdown>\n";

    $scope.dropdownOptions = [
    {
      text: 'option1',
      value: '1'
    },
    {
      text: 'option2',
      value: '2'
    }];

    $scope.dropdownFieldValue = "";
    $scope.dropdownFieldText = "";
    $scope.dropdownFieldDescription = "";
    $scope.dropdownSearch = false;
    $scope.dropdownReturnObject = false;
    $scope.dropdownCodeModel = "";
    $scope.dropdownDisabled = "";

    $scope.autoSuggestCode = "<autosuggest\n"
    +"\tng-Model = \"modelValue\"\n"
    +"\toptions = \"options\"\n"
    +"\tvalue-Field = \" 'value' \"\n"
    +"\treturnObject = \" 'returnObject' \"\n"
    +"\tplaceholder = \" 'Select a type' \"\n"
    +"\t>\n"
    +"</autosuggest>\n";

    $scope.autoSuggestOptions = [
    {
      name: 'option1',
      value: '1'
    },
    {
      name: 'option2',
      value: '2'
    }];

    $scope.autoSuggestCodeModel = "";

    $scope.callenderCode = "<callender-Code ng-Model = \"modelValue\">\n"
    +"</callender-Code>\n";

    $scope.searchableDropdownCode = "<dropdown\n"
    +"\tng-Model = \"modelValue\"\n"
    +"\toptions = \"options\"\n"
    +"\ttext-Field = \" 'text' \"\n" 
    +"\tvalue-Field = \" 'value' \"\n"
    +"\tdescription-Field = \" 'description' \"\n"
    +"\tplaceholder = \" 'Select a type' \"\n"
    +"\textraOptions = \" 'extraOptions' \"\n"
    +"\treturnObject = \" 'returnObject' \"\n"
    +"\tsearch = \" 'search' \"\n"
    +"\tdisabled = \" 'disabled' \"\n"
    +"\t>\n"
    +"</dropdown>\n";

    $scope.dumpObjectIndented = function(obj, indent)
    {
      var result = "";
      if (indent == null) indent = "";

      for (var property in obj)
      {
        var value = obj[property];
        if (typeof value == 'string')
          value = "'" + value + "'";
        else if (typeof value == 'object')
        {
          if (value instanceof Array)
          {
            // Just let JS convert the Array to a string!
            value = "[ " + value + " ]";
          }
          else
          {
            // Recursive dump
            // (replace "  " by "\t" or something else if you prefer)
            var od = DumpObjectIndented(value, indent + "  ");
            // If you like { on the same line as the key
            //value = "{\n" + od + "\n" + indent + "}";
            // If you prefer { and } to be aligned
            value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
          }
        }
        result += indent + "'" + property + "' : " + value + ",\n";
      }
      return result.replace(/,\n$/, "");
    }

    $scope.alerts = [];
    $scope.alerts.push({
        message:'Removal successful!',
        level:'success'
      }); 
    $scope.alertsCode = "<master-Alerts alerts = \"alertsModelValue\">\n"
    +"</master-Alerts>\n";

    $scope.javascript_api_functions = [];


  }]
);

/** Controller: dropdown */ 
ppdpControllers.controller('dropdown', ['$scope',
  function($scope) {
    
    $scope.selected_value = $scope.placeholder;
    $scope.selected_option = {};
    $scope.options_map = {};
    
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
    
    if (typeof $scope.options === 'object'){
      for(var i = 0; i < $scope.options.length; i++){
        if (typeof $scope.options[i] === 'object'){
          $scope.options_map[$scope.options[i][$scope.value_field]] = $scope.options[i];
        }
      }
    }
  
    console.log('typeof $scope.options '+typeof $scope.options);
    
    $scope.select = function(option){
      
      $scope.selected_value = option[$scope.text_field];
      $scope.selected_option = option;

      if ($scope.returnObject === 'true'){
        $scope.ngModel = option;
      }
      else{
        $scope.ngModel = option[$scope.value_field];
      }
      
    };

    $scope.$watch('options',function(){

      if (typeof $scope.options === 'object'){
        
        console.log($scope.options);
        
        for(var i = 0; i < $scope.options.length; i++){
          if (typeof $scope.options[i] === 'object'){
            $scope.options_map[$scope.options[i][$scope.value_field]] = $scope.options[i];
          }
        }
        
      }
      
      if ($scope.ngModel !== '' && $scope.ngModel !== undefined){

        if (typeof $scope.ngModel === 'object'){
          $scope.selected_value = $scope.ngModel[$scope.text_field];
          $scope.selected_option = $scope.ngModel;
          
        }
        else{
          $scope.selected_value = $scope.options_map[$scope.ngModel][$scope.text_field];
          $scope.selected_option = $scope.options_map[$scope.ngModel];
        }
      }
      else{
        $scope.selected_value = $scope.placeholder;
      }
      

    });
    
    $scope.$watch('ngModel', function(){

      if ($scope.ngModel !== '' && $scope.ngModel !== undefined){

        if (typeof $scope.ngModel === 'object'){
          $scope.selected_value = $scope.ngModel[$scope.text_field];
          $scope.selected_option = $scope.ngModel;
          
        }
        else{
          $scope.selected_value = $scope.options_map[$scope.ngModel][$scope.text_field];
          $scope.selected_option = $scope.options_map[$scope.ngModel];
        }
      }
      else{
        $scope.selected_value = $scope.placeholder;
      }
      
    });
  
  }]
);

/** Controller: files */
ppdpControllers.controller('files', ['$rootScope','$scope', '$routeParams', 'ppdpAPIService', '$location','$timeout', '$filter',
  function($rootScope, $scope, $routeParams, ppdpAPIService, $location, $timeout, $filter) {
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    
    //files which will be shown on table
    $scope.files = [];
    $scope.files_loading = true;
    $scope.assigning = false;
    $scope.deleting = false;
    
    $scope.users = [];
    $scope.selected_files = [];
    $scope.rows_selected = false;
    $scope.totalRows = 0;
    $scope.alerts = [];
    $scope.assign_alerts = [];
    $scope.assignment = {type:{name:'Enter documents', id:1},users:[]};
    
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
      $scope.files_loading = true;
      
      //call retrieve api function
      ppdpAPIService.file.retrieve($scope.params).
        success(function(data, status, headers, config) {
          $scope.files_loading = false;
          //load data into files
          $scope.files = data;
          
        }).
        error(function(data, status, headers, config) {
          $scope.files_loading = false;
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
      
      //call retrieve api function get total num
      ppdpAPIService.file.totalNum($scope.params).
        success(function(data, status, headers, config) {
  
          //load data into users
          $scope.totalRows = data.total;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
    }
    
    $scope.update_results();
    
    /**
     * update_batches() Updates batches to be shown when batch
     *
     * @return NULL
     */
    $scope.update_users = function(){
      //call retrieve api function
      ppdpAPIService.user.retrieve({}).
        success(function(data, status, headers, config) {
          //load data into batch
          
          for(var i = 0;i < data.length; i+=1){
            $scope.users.push({first_name:data[i].first_name, last_name:data[i].last_name, name:data[i].first_name + ' ' + data[i].last_name, id:data[i].id,email:data[i].email});
          }
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
    }
    
    $scope.update_users();

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
    
    /**
     * toggle_select_all() Update selected property of files and
     * updates all selected_batches
     *
     * @param <String> index
     * @return NULL
     */
    $scope.toggle_select_all = function(){
      var i = 0;
      for(i = 0 ;i < $scope.files.length; i+=1){
        ppdpAPIService.toggle_select($scope.files,i);
        $scope.selected_files = ppdpAPIService.get_selected_subset($scope.files);
      }
    }
    
    //if the user has the authority
    if($rootScope.user_account.role.id >= 2){
    
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
        {
          text : 'Remove',
          glyphicon : 'trash',
          function_callback : function(){$('#deleteModal').modal('toggle')}, 
        }
      ];
    
    }
    
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
        text:'Creator',
        value: function(row){
          return row.creator.first_name;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'creator.first_name'
      },
      {
        text:'Date Created',
        value: function(row){
          if (row.date_added) {
            var date = new Date(row.date_added);
            date.setDate(date.getDate() + 1);
            return $filter('date')(date, "M/dd/yyyy");
          }
          else{
            return 'unspecified';
          }
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_added'
      },
      {
        text:'Assigned',
        value: function(row){
          return (row.assigned)?'Assigned':'Unassigned';
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'assigned'
      }
    ];

    /**
     * details() bring up file modal
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(id,option){
      $('#downloadModal').modal('toggle');
      $scope.downloadName = $scope.files[id].name;
      $scope.downloadLink = $scope.files[id].url;
    };
    
    /**
     * delete() deletes selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.delete = function(){
      
      $scope.deleting = true;
      
      var num = 0;
      $scope.alerts = [];
      
      for(var i = 0; i < $scope.selected_files.length; i+=1){
        ppdpAPIService.file.delete($scope.selected_files[i]).
          success(function(data, status, headers, config) {
            
            $scope.deleting = false;
            
            $scope.update_results();

            num+=1;

            if (num == $scope.selected_files.length){
              //if succesful show message to user
              $scope.alerts.push({
                message:'Delete successful!',
                level:'success'
              }); 
              
              $('#deleteModal').modal('hide');
              $scope.selected_files = [];
              
              //after alert has been on screen for 2 seconds it is removed
              /*$timeout(function(){
                $('.alert').bind('closed.bs.alert', function () {
                  $scope.alerts = [];
                });
                $(".alert").alert('close');
              }, 2000);*/ 
            }

          }).
          error(function(data, status, headers, config) {
            
            $scope.deleting = false;
            
            $scope.alerts.push({
              message:'Trouble connecting to server. File "'+ $scope.selected_files[i].name +'" could not be deleted',
              level:'warning',
              debug_data: status+ ' : ' + data,
              config: config
            });
          });
      }
      
    };
    
    /**
     * 
     * 
     * 
     */
    $scope.upload_file = function(files){
      
      console.log(files);
      
      $scope.alerts = [];
      
      var _file;
      var num = 0;
      
      for(var i = 0 ; i < files.length; i+=1){
        
        //call retrieve api function get total num

        var _data = {"name": files[i].name};
        
        ppdpAPIService.file.create(_data,files[i]).
          success(function(data, status, headers, config) {
            $scope.update_results();

            num+=1;

            if (num == files.length){
              //if succesful show message to user
              $scope.alerts.push({
                message:'successfully Uploaded ' + files.length + ' file(s)',
                level:'success'
              }); 
              
              $('#createFileModal').modal('hide');
              
              //after alert has been on screen for 2 seconds it is removed
              /*$timeout(function(){
                $('.alert').bind('closed.bs.alert', function () {
                  $scope.alerts = [];
                });
                $(".alert").alert('close');
              }, 2000);*/ 
            }

          }).
          error(function(data, status, headers, config) {
            $scope.alerts.push({
              message:'Trouble connecting to server. File "'+ 'files[i].name'+'" could not be uploaded',
              level:'warning',
              debug_data: status+ ' : ' + data,
              config: config
            });
        });
        
      }
    
    }
    
    /**
     * assign() creates new assignment
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.assign = function(){
      
      var success = true;
      var num = 0;
      $scope.assign_alerts = [];
      $scope.alerts = [];
      
      //validate form
      var user_selected = false;
      var error_found = false;
      $scope.assigning = true;
      
      //check if type selected
      if ($scope.assignment.type === '' ){
        $scope.assign_alerts.push({
          message:'Task must be selected',
          level:'danger',
        });
        
        error_found = true;
      }
      
      //check if user selected
      for(var j = 0 ; j < $scope.users.length; j+=1){
        
        if ($scope.users[j].selected){
          user_selected = true;
        }
        
      }
      if (!user_selected){
        $scope.assign_alerts.push({
          message:'one or assignees must be checked',
          level:'danger',
        });
        
        error_found = true;
      }
      
      if (error_found === true){
        $scope.assigning = false;
        return false;
      }
      
      //send a create request to api for each selected file
      for(var i = 0; i < $scope.selected_files.length; i+=1){
        
        $scope.assignment.file = $scope.files[i];
        
        //create new request object to be sent to api
        var assignment_request = jQuery.extend( true, {},$scope.assignment);
        
        //add each selected user to the request
        for(j = 0 ; j < $scope.users.length; j+=1){
          
          if ($scope.users[j].selected){
            assignment_request.users.push($scope.users[j]);
          }
          
        }

        //send create request to api
        ppdpAPIService.assignment.create(assignment_request).
          success(function(){
            
            //count the number of batches assigned
            num += 1;
            
            $scope.assigning = false;
            
            if (num == $scope.selected_files.length){
              
              //if succesful show message to user
              $scope.alerts.push({
                message:'Assignment created!',
                level:'success'
              });
              
              $('#assignModal').modal('hide');
              $scope.selected_batches = [];
            }
            
            $scope.update_results();
            
          }).
          error(function(data, status, headers, config) {
            
            error_found = true;
            $scope.assigning = false;
            $scope.alerts.push({
              message:'Trouble connecting to server.',
              level:'warning',
              debug_data: status+ ' : ' + data,
              config: config
            });
            
          });
        
      }
      
    
      //of sucessful in creating assignments notify user
      if (success){
        
      }
       
      //after alert has been on screen for 2 seconds it is removed
      /*
      $timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);
      */
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
ppdpControllers.controller('header', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$rootScope',
  function($scope, $routeParams, ppdpAPIService, $location, $rootScope) {
    console.log('header');
    
    $scope.logout = function(){
      
      ppdpAPIService.account.logout().
        success(function(data, status, headers, config){
          $rootScope.user_account = 'undefined';
          $location.path('login');
        }).
        error(function(data, status, headers, config){
        });
      
    };
    
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
ppdpControllers.controller('login', ['$rootScope','$scope', '$routeParams', '$location', 'ppdpAPIService',
  function($rootScope, $scope, $routeParams, $location, ppdpAPIService) {
    
    // Global variables for controller
    $scope.alerts = [];
    $scope.account = {password:'',username:''};
    $scope.loading = false;
    
    /**
     * login() tries to log user in with specified account data from scope. 
     * If it was possible it changes page to assignments. If false it produces an alert saying
     * it failed
     * 
     * @param NULL
     * @returns NULL
     */
    $scope.login = function(){
      
      $scope.loading = true;
      
      $scope.alerts = [];
      
      console.log($scope.login_form);
      
      //login_form
      if ($scope.login_form.$invalid){
        
        if ($scope.login_form.email.$valid == false){
          $scope.loading = false;
          $scope.alerts.push({
            message: 'Valid Email Address is required.',
            level:'danger',
          });
        }
        
        if ($scope.login_form.password.$valid == false) {
          $scope.loading = false;
          $scope.alerts.push({
            message: 'Password is required.',
            level:'danger',
          });
        }

      }
      else{
        ppdpAPIService.account.login($scope.account).
          success(function(data, status, headers, config){
            
            $rootScope.user_account = data;
            $scope.loading = false;
            
            //show user alert stating they have successfully logged in
            $scope.alerts.push({
              message:'You have successfully logged in',
              level:'success',
            });
            
            //send user to assignments page
            $location.path('/assignments');
            
          }).
          error(function(data, status, headers, config){
            
            console.log(data);
            $scope.loading = false;
            
            switch(status){
              case 403:
                $scope.alerts.push({
                  message:'No account with password was found.',
                  level:'danger'
                });
                break;
                
              default:
                $scope.alerts.push({
                  message:'Trouble connecting to server (LDAP may not be available).',
                  level:'warning',
                  debug_data: status+ ' : ' + data,
                  config: config
                });
                break;
            }
            
          });
      }
    }
    
  }]
);

/** Controller: menu_sidebar */
ppdpControllers.controller('menu_sidebar', ['$rootScope', '$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($rootScope, $scope, $routeParams, ppdpAPIService, $location) {

    //json representation of menu sidebar
    $scope.menu = [
      {
        title: 'Assignments',
        href: '#/assignments',
        path:'/assignments',
        menu:[]
      },
      {
        title: 'Documents',
        href: '#/newsclips',
        menu:[{
          title: 'Newsclips',
          href: '#/newsclips',
          path:['/newsclips'],
        },
        {
          title: 'Bills',
          href: '#/bills',
          path:['/bills'],
        }],
        path:['/','/newsclips','/newsclip']
      },
      {
        title: 'Batches',
        href: '#/batches',
        menu:[],
        path:['/batches','/batch']
      },
      {
        title: 'Files',
        href: '#/files',
        menu:[],
        path:'/files'
      },
    ];
    
    
    //if the user has the authority
    if($rootScope.user_account.role !== undefined && $rootScope.user_account.role.id >= 2){
      
      $scope.menu[1].menu.push({
        title: 'Create',
        href: '#/create_newsclip',
        path:['/create_newsclip','/newsclip'],
        type: 'dropdown',
        options: [{
          title: 'Newsclip',
          href: '#/create_newsclip',
          path:['/create_newsclip','/newsclip'],
        },
        {
          title: 'Bill',
          href: '#/create_bill',
          path:['/create_bill','/bill'],
        }]
      });
      
      $scope.menu[2].menu.push({
        title: 'Create Batch',
        href: 'javascript:void(0)',
        path:'#/create_batch',
        click: function(){$('#createBatchModal').modal('toggle')}
      });
      
      $scope.menu[3].menu.push({
        title: 'Upload',
        href: 'javascript:void(0)',
        path:'#/upload',
        click: function(){$('#createFileModal').modal('toggle')}
      });
    }
  
    // if user is logged in add link to manage users
    if($rootScope.user_account.role !== undefined && $rootScope.user_account.role.id > 2){
      $scope.menu.push({
        title: 'Users',
        href: '#/users',
        path:'/users',
        menu:[{
          title: 'Add User',
          href: '#/add_user',
          path:['/add_user']
        }],
      });
    }

    //determins if menu item has been selected and if so it adds 'active class'
    $scope.menu.forEach(function(link) {
      
      var has_link = false;
      
      //alert($location.path());
      
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
ppdpControllers.controller('newsclip', ['$rootScope', '$scope', '$routeParams', 'ppdpAPIService', '$location', '$http', '$timeout', '$filter',
  function ($rootScope, $scope, $routeParams, ppdpAPIService, $location, $http, $timeout, $filter) {
    console.log('newsclip');
    
    //global variables
    //document variable which represents the loaded document
    $scope.doc = {
        abstract:'',
        comments:'',
        date:'',
        date_added: '',
        headline:'',
        policy:'',
        policy_code:'',
        type:'',
    };
    
    $scope.assignment = {type:'', id:3, users:['']};
    $scope.batch_document_request = {};
    $scope.loading = false;
    
    //variable to keep track of recently searched documents for navigation 
    $scope.documents = [];
    $scope.users = [];
    $scope.batches = [];
    $scope.policy_codes = [];
    $scope.types = [];
    $scope.saving = false;
    $scope.adding_documents_to_batch = false;
    
    //keep track of url variables
    $scope.old_params = jQuery.extend(true, {}, $routeParams);
    $scope.params = jQuery.extend(true, {}, $routeParams);
    jQuery.extend(true, $scope.params, {
      offset:parseInt($routeParams.docId),
      limit:1,
      query:''
    });

    // TODO: -- swap out for something that makes sense
    $scope.tiebreaker = $routeParams.tiebreak;
    
    //alerts to be displayed on screen
    $scope.alerts = [];
    $scope.urgent_alerts = [];
    $scope.assign_alerts = [];
    
    //news papers to be displayed in 'Newspaper' dropdown
    ppdpAPIService.newspaper.retrieve({}).
      success(function(data, status, headers, config){
        $scope.newspapers = data;
      }).
      error(function(data, status, headers, config){
        $scope.urgent_alerts.push({
          message:'Error connecting to server',
          level:'warning',
          debug_data: status+ ' : ' + data,
          config: config
        }); 
      });
    
    //policycodes to be displayed in 'Code' dropdown
    ppdpAPIService.code.retrieve({}).
      success(function(data, status, headers, config){
        $scope.policy_codes = data;
      }).
      error(function(data, status, headers, config){
        $scope.urgent_alerts.push({
          message:'Error connecting to server',
          level:'warning',
          debug_data: status+ ' : ' + data,
          config: config
        }); 
      });
      
    //type to be displayed in 'Types' dropdown
    ppdpAPIService.newsclipType.retrieve({}).
      success(function(data, status, headers, config){
        $scope.types = data;
      }).
      error(function(data, status, headers, config){
        $scope.urgent_alerts.push({
          message:'Error connecting to server',
          level:'warning',
          debug_data: status+ ' : ' + data,
          config: config
        }); 
      });
    
    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Edit information');

    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      
      $scope.loading = true;
	  
  	  var params = {
  		offset:0, 
  		limit:$routeParams.docId+1, 
  		query:$scope.old_params.query
  	  };
  	  
  	  if ($routeParams.batch_id !== undefined){
  		params.batch_id = $routeParams.batch_id;
  	  }
  	  
      
      //retrieve a list of documents based off of what is in the uri parameters 
      ppdpAPIService.doc.retrieve(params).
        success(function(data, status, headers, config) {

          $scope.documents = data;
          
          $scope.loading = false;
          
          //get data for doc
          ppdpAPIService.doc.retrieve({id:data[$routeParams.docId].id}).
            success(function(doc_data, status, headers, config) {
              //load data into doc
              $scope.doc = jQuery.extend(true, {}, doc_data);

              var dt = new Date($scope.doc.date_time);
              dt.setDate(dt.getDate() + 1);
              $scope.doc.date_time = $filter('date')(dt, "M/dd/yyyy");
              
              //alert(JSON.stringify($scope.doc))
              console.log($scope.doc);

              //if the user is an administrator allow them to create and assign newsclips
              $scope.button_functions = [];
              if($rootScope.user_account.role.id !== undefined && $rootScope.user_account.role.id >= 2){

                var option = {};

                if ($scope.doc.batch.id === null){
                  option = {
                    text : 'Add to Batch',
                    glyphicon : 'folder-close',
                    function_callback : function(){$('#batchModal').modal('toggle')}, 
                  };
                }
                else{
                  option = {
                    text : 'Remove from Batch',
                    glyphicon : 'folder-close',
                    function_callback : function(){$('#removeFromModal').modal('toggle')}, 
                  };
                }

                /** directive masterTopMenu data. 
                 *  
                 *  buttons to show up in menu
                 * 
                 */
                $scope.button_functions = [
                  option,
                  {
                    text : 'Remove',
                    glyphicon : 'trash',
                    function_callback : function(){$('#deleteModal').modal('toggle')}, 
                  }
                ];
              
              };  
              
              console.log($scope.doc);

              //if document needs tiebreak
              if($rootScope.user_account.role.id !== undefined && $scope.doc.status_id == 2){

                //find out if user entered code
                var user_entered_code = false;
                var users_code;
                for(var i = 0; i < $scope.doc.codes.length; i+=1){
                  user_entered_code = ($scope.doc.codes[i].user.email == $rootScope.user_account.email);
                  if (user_entered_code){
                    users_code = $scope.doc.codes[i].policy_code.id;
                  }
                }

                // if acount is admin, sr research or a user who has not entered a code allow them to tiebreak assigned newsclip
                if ($rootScope.user_account.role.id >= 2 || user_entered_code == false){
                  $scope.tiebreaker = true;
                
                  //if the user has the authority
                  if($rootScope.user_account.role.id >= 2){
                  
                    $scope.button_functions.push({
                      text : 'Assign',
                      glyphicon : 'folder-close',
                      function_callback : function(){$('#assignModal').modal('toggle')}, 
                    });
                  
                  }

                  console.log($rootScope.user_account.role);
                }
                else if (user_entered_code){
                  //if user has ented in code show them their code
                  $scope.doc.code = users_code;
                }

              }
              
            }).
            error(function(data, status, headers, config) {
              $scope.alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',
                debug_data: status+ ' : ' + data,
                config: config
              });
          });
          
        }).
        error(function(data, status, headers, config) {
          
          $scope.loading = false;
          
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
      
      //call retrieve api function get total num
      ppdpAPIService.doc.totalNum({query:$routeParams.query}).
        success(function(data, status, headers, config) {
  
          //load data into users
          $scope.totalRows = data.total;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
    }
    
    $scope.update_results();
    
    /**
     * update_users() Updates list of users
     *
     * @return NULL
     */
    $scope.update_users = function(){
      //call retrieve api function
      ppdpAPIService.user.retrieve({}).
        success(function(data, status, headers, config) {
          //load data into batch
          
          for(var i = 0;i < data.length; i+=1){
            $scope.users.push({first_name:data[i].first_name, last_name:data[i].last_name, name:data[i].first_name + ' ' + data[i].last_name, id:data[i].id, email:data[i].email});
          }
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
    }
    
    $scope.update_users();
    
    /**
     * update_batches() Updates batches to be shown when batch
     *
     * @return NULL
     */
    $scope.update_batches = function(){
      //call retrieve api function
      ppdpAPIService.batch.retrieve({}).
        success(function(data, status, headers, config) {
          //load data into batch
          $scope.batches = data;
          
          for(var i = 0; i < batches.length; i+=1 ){
            batches[i].year = $filter('date')(new Date(row.date_added), "yyyy")
          };
          
            //fix me
          $('#addbatchselect').selectpicker({
            'selectedText': 'cat'
          });
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
          /*$('.selectpicker').selectpicker({
            'selectedText': 'cat'
          });*/
      });
    };
    
    $scope.update_batches();
    
    /**
     * back() redirect to users
     *
     * @param <String> index
     * @return NULL
     */
    $scope.back = function(){
      console.log("back");
      
      //check if params has batchId go back to batch if not go to newsclips
      if (typeof($routeParams.batchId) !== 'undefined'){
        $location.path("/batch/" + $routeParams.batchId).search($scope.old_params);
      }
      else{
        $location.path("/newsclips").search($scope.old_params);
      }
    };
    
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
      $scope.saving = true;
      
      //call update api function
      ppdpAPIService.doc.update($scope.doc).
        success(function(data, status, headers, config) {
 
          $scope.saving = false;
 
          //if succesful show message to user
          $scope.alerts.push({
            message:'Save successful!',
            level:'success',
            debug_data: $scope.doc
            
          }); 
          
          console.log($scope.doc);
          
        }).
        error(function(data, status, headers, config) {
          
          $scope.saving = false;
          
          switch(status){
            
            case 403:
              
              $scope.alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',  
              });
              
              break;
            
            case 404:
              
              $scope.alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',
                debug_data: status+ ' : ' + data,
                config: config
              });
              
              break;
              
            default:
            
              $scope.alerts.push({
                message:'Unknown problem.',
                level:'warning',
                debug_data: status+ ' : ' + data,
            config: config
              });
            
              break;
          }
      });
      
    };
    
    $scope.delete = function(){
      //call update api function
      ppdpAPIService.doc.delete($scope.doc).
        success(function(data, status, headers, config) {
 
          //if succesful show message to user
          $scope.urgent_alerts.push({
            message:'Delete successful!',
            level:'success',
          }); 
          
          $('#deleteModal').modal('hide');
          
          $timeout(function(){
            $location.path("/newsclips");
            $scope.$apply();
          }, 1000);
          
        }).
        error(function(data, status, headers, config) {
          
          switch(status){
            
            case 403:
              
              $scope.urgent_alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',  
                debug_data: status+ ' : ' + data
              });
              
              break;
            
            case 404:
              
              $scope.urgent_alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',
                debug_data: status+ ' : ' + data,
                config: config
              });
              
              break;
              
            default:
            
              $scope.urgent_alerts.push({
                message:'Unknown problem.',
                level:'warning',
                debug_data: status+ ' : ' + data,
            config: config
              });
            
              break;
          }
      });
    };
    
    /**
     * assign() creates new assignment
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.assign = function(){
      
      var success = true;

      $scope.assignment.document = $scope.doc;
      
      //validate form
      var user_selected = false;
      var error_found = false;
      
      //check if type selected
      if ($scope.assignment.type === '' ){
        $scope.assign_alerts.push({
          message:'Task must be selected',
          level:'danger',
        });
        
        error_found = true;
      }
      
      //check if user selected
      if ($scope.assignment.users[0] === ''){
        $scope.assign_alerts.push({
          message:'one or assignees must be checked',
          level:'danger',
        });
        
        error_found = true;
      }
      
      if (error_found === true){
        return false;
      }
      
      //create new request object to be sent to api
      var assignment_request = jQuery.extend( true, {},$scope.assignment);
          
      //send create request to api
      console.log(assignment_request);
      ppdpAPIService.assignment.create(assignment_request).
        success(function(){
          success = true;
        }).
        error(function(data, status, headers, config) {
          $scope.urgent_alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
          
        });
 
      $('#assignModal').modal('hide');
    
      //of sucessful in creating assignments notify user
      if (success){
        //if succesful show message to user
        $scope.urgent_alerts.push({
          message:'Assignment created!',
          level:'success'
        });
      }
       
      //after alert has been on screen for 2 seconds it is removed
      $timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);
    }
    
    /**
     * add_to_batch() Adds document to bach
     * 
     * @param NULL
     * @return NULL
     * 
     */
    $scope.add_to_batch = function(){
      
      $scope.adding_documents_to_batch = true;
      
      ppdpAPIService.batch.adddocument({doc_id:$scope.doc.id, batch_id:$scope.selected_batch.id}).
        success(function(data, status){

          $('#batchModal').modal('hide');
  
          //if succesful show message to user
          $scope.alerts.push({
            message: 'Document was successfully added to the batch',
            level:'success'
          });
          
          $scope.adding_documents_to_batch = false;
          
          $scope.selected_documents = [];
        
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
          
          $scope.adding_documents_to_batch = false;
        });
        
    };
    
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
      
    $scope.$watch('selected_batch', function() {
      
      if ($scope.selected_batch){
        $('.selectpicker').selectpicker('render');
      }
      
      
    });
    
    $scope.$watch('doc.code', function() {
      
      if ($scope.selected_batch){
        $('.selectpicker').selectpicker('render');
      }
      
    });
    
    $scope.$watch('doc', function() {
      
      if ($scope.selected_batch){
        $('.selectpicker').selectpicker('render');
      }
      
    });
    
    
    //Jquery
		$('#date_time').datetimepicker({
			pickTime: false
		});
    
    $('.policyselect').selectpicker({
      'selectedText': 'cat'
    });

    $('#batchModal').on('show.bs.modal', function (e) {
      $('.selectpicker').selectpicker('render');
    });
    
  }]
);

/** Controller: newsclips */
ppdpControllers.controller('newsclips', ['$rootScope', '$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout', '$filter',
  function($rootScope, $scope, $routeParams, ppdpAPIService, $location, $timeout, $filter) {
    console.log('newsclips');
    
    // Global variables for controller
	
	//if user has batch_id in the params send the user to the batch page
    if ($routeParams.batch_id !== undefined){
	  $location.path('batch/'+$routeParams.batch_id);
    }
    
    //newsclips to be shown in table
    $scope.documents = [];
    $scope.documents_loading = true;
    $scope.deleting = false;
    $scope.adding_documents_to_batch = false;
    
    //batches to be shown in dropdown when adding to batch
    $scope.batches = [];
    
    //documents which bave been check boxed
    $scope.selected_documents = [];
    
    //alerts to be shown on screen
    $scope.alerts = [];
    
    //request to add to batch
    $scope.selected_batch = '';
    
    //handle url parameters from previous page
    $scope.params = jQuery.extend(true, {offset:0,limit:10}, $routeParams );
    $scope.params.offset = parseInt($scope.params.offset);
    $scope.params.limit = parseInt($scope.params.limit);
    console.log($scope.params);

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');
    
    /**
     * update_batches() Updates batches to be shown when batch
     *
     * @return NULL
     */
    $scope.update_batches = function(){
      //call retrieve api function
      ppdpAPIService.batch.retrieve($scope.params).
        success(function(data, status, headers, config) {
          //load data into batch
          $scope.batches = data;
          
          for(var i = 0; i < batches.length; i+=1 ){
            $scope.batches[i].year = $filter('date')(new Date(row.date_added), "yyyy")
          }
          
          $('.selectpicker').selectpicker({
            'selectedText': 'cat'
          });
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
          /*$('.selectpicker').selectpicker({
            'selectedText': 'cat'
          });*/
      });
    };
    
    $scope.update_batches();
    
    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      $scope.documents_loading = true;
      
      //call retrieve api function
      ppdpAPIService.doc.retrieve($scope.params).
        success(function(data, status, headers, config) {
          //load data into users
          $scope.documents = data;
          $scope.documents_loading = false;
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
          $scope.documents_loading = false;
      });
      
      //call retrieve api function get total num
      ppdpAPIService.doc.totalNum($scope.params).
        success(function(data, status, headers, config) {
        
          //load data into users
          $scope.totalRows = data.total;
          console.log($scope.totalRows);
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
    };
    
    $scope.update_results();
    
    //if the user is an administrator allow them to create and assign newsclips
    $scope.button_functions = [];
    if($rootScope.user_account.role !== undefined && $rootScope.user_account.role.id >= 2){
    
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
    
    }
    
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
   
          return (row.headline == 'NULL')?'[Not Applicable]':row.headline;
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
          var date = new Date(row.date_added);
          date.setDate(date.getDate() + 1);
          return $filter('date')(date, "M/dd/yyyy");
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'date_added'
      },
      {
        text:'Creator',
        value: function(row){
          return row.creator.first_name;
        },
        click: function(id, row){
          $scope.details(id);
        },
        attributes:'',
        field_text: 'creator.first_name'
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
          return (row.assigned)?'Assigned':'Unassigned';
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
          return parseInt(row.id);
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
    };
    
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
  
    };
    
    // FIXME: need to implement the angular way
    /**
     * details() redirect to batch
     * id in url is based on passed index
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(id){
      $location.path("/newsclip/"+(id+$scope.params.offset)).search($scope.params);
    };
    
    /**
     * delete() deletes selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.delete = function(){
      
      $scope.deleting = true;
      
      var num = 0;
      
      for(var i = 0; i < $scope.selected_documents.length; i+=1){
        ppdpAPIService.doc.delete($scope.selected_documents[i]).
          success(function(data, status, headers, config) {
            $scope.update_results();

            num+=1;

            if (num == $scope.selected_documents.length){
              
              $scope.deleting = false;
              
              //if succesful show message to user
              $scope.alerts.push({
                message:'Delete successful!',
                level:'success'
              }); 
              
              $('#deleteModal').modal('hide');
              $scope.selected_documents = [];
              
              //after alert has been on screen for 2 seconds it is removed
              /*$timeout(function(){
                $('.alert').bind('closed.bs.alert', function () {
                  $scope.alerts = [];
                });
                $(".alert").alert('close');
              }, 2000);*/ 
            }

          }).
          error(function(data, status, headers, config) {
            
            $scope.deleting = false;
            
            $scope.alerts.push({
              message:'Trouble connecting to server. documents could not be deleted',
              level:'warning',
              debug_data: status+ ' : ' + data,
              config: config
            });
          });
      }
      $scope.selected_documents = [];
      $('#deleteModal').modal('hide');
      
      //if succesful show message to user
      $scope.alerts.push({
        message:'Delete successful!',
        level:'success'
      }); 
      
      //after alert has been on screen for 2 seconds it is removed
      $timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);
    };
    
    /**
     * add_to_batch() Adds document to bach
     * 
     * @param NULL
     * @return NULL
     * 
     */
    $scope.add_to_batch = function(){
      
      $scope.adding_documents_to_batch = true;
      var num = 0;
      
      for(var i = 0; i < $scope.selected_documents.length; i+=1){
        ppdpAPIService.batch.adddocument({doc_id:$scope.selected_documents[i].id, batch_id:$scope.selected_batch.id}).
          success(function(data, status){
            
            num += 1;
            
            if (num == $scope.selected_documents.length){
              $('#batchModal').modal('hide');
      
              //if succesful show message to user
              $scope.alerts.push({
                message: 'Document was successfully added to the batch',
                level:'success'
              });
              
              $scope.adding_documents_to_batch = false;
              
              $scope.selected_documents = [];
              
            }
            
          }).
          error(function(data, status, headers, config) {

            switch(status){
              case 400:
                $scope.alerts.push({
                  message:'Newsclip has already been added to batch',
                  level:'danger',
                });
                break;
              default:
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',
                  debug_data: status+ ' : ' + data,
                  config: config
                });
                break;
            }

            $scope.adding_documents_to_batch = false;
          });
        
      }
      
      
      
      //after alert has been on screen for 2 seconds it is removed
      /*$timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);*/
    }

    /**
     * 'params' change event
     * 
     * when params changes page should change to newsclip with id equaling offset id
     * This will also upate the query string
     * 
     */
    $scope.$watch('params', function() {
      $scope.update_results();
      return $scope.params;
    }, true); // initialize the watch
    
    $scope.$watch('selected_batch', function() {
      
      if ($scope.selected_batch){
        $('.selectpicker').selectpicker('render');
      }
      
      
    });

    $('#batchModal').on('show.bs.modal', function (e) {
      $('.selectpicker').selectpicker('render');
    });
    
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
    
    $scope.$watch('params.offset', function(){
      $('#left_button').prop('disabled', ($scope.params.offset == 0) );
      //$('#right_button').prop('disabled', ($scope.displayed_limit == $scope.num_rows) );
    });
    
    $scope.$watch('params.limit', function(){
      $scope.displayed_limit = Math.min($scope.num_rows ,$scope.params.offset+$scope.params.limit);
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
    $scope.totalRows = 0;
    $scope.show_paging = true;
    $scope.saving = false;
    $scope.loading = false;
    
    //retrieve all roles
    ppdpAPIService.role.retrieve({}).
      success(function(data, status, headers, config){
        $scope.roles = data;
      }).
      error(function(data, status, headers, config){
        $scope.urgent_alerts.push({
          message:'Error connecting to server',
          level:'warning',
          debug_data: status+ ' : ' + data,
          config: config
        }); 
      });
    
    //keep track of url variables
    $scope.old_params = jQuery.extend(true, {}, $routeParams);
    $scope.params = jQuery.extend(true, {}, $routeParams);
    jQuery.extend(true, $scope.params, {
      offset:parseInt($routeParams.userId),
      limit:1,
      query:''
    });
    
    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      
      $scope.loading = true;
    
      //call retrieve api function
      ppdpAPIService.user.retrieve({offset:0, limit:parseInt($routeParams.userId+1), query:$scope.old_params.query}).
        success(function(data, status, headers, config) {
          
          $scope.loading = false;
  
          //load data into users
          $scope.users = data;
            
          //get data for doc
          ppdpAPIService.user.retrieve({email:$scope.users[$routeParams.userId].email}).
            success(function(data, status, headers, config) {
              //load data into doc
              $scope.user = jQuery.extend(true, {}, data);
            }).
            error(function(data, status, headers, config) {
              $scope.alerts.push({
                message:'Trouble connecting to server.',
                level:'warning',
                debug_data: status+ ' : ' + data,
                config: config
              });
            });
          
        }).
        error(function(data, status, headers, config) {

          $scope.loading = false;

          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data,
            config: config
          });
      });
      
      //call retrieve api function get total num
      ppdpAPIService.user.totalNum({offset:0,limit:100000,query:$routeParams.query}).
        success(function(data, status, headers, config) {
  
          //load data into users
          $scope.totalRows = data.total;
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data: status+ ' : ' + data
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
      $scope.saving = true;
      
      console.log($scope.create_user_form);
      
      //call update api function
      if ($scope.create_user_form.$invalid){
        $scope.alerts.push({
          message:'All fields with * must be filled in',
          level:'danger',
        }); 
        console.log($scope.user);
        
        $scope.saving = false;
      }
      else{
        ppdpAPIService.user.update($scope.user).
          success(function(data, status, headers, config) {
   
            $scope.saving = false;
   
            //if succesful show message to user
            $scope.alerts.push({
              message:'Save successful!',
              level:'success',
              debug_data: $scope.user
            }); 
            
            console.log($scope.user);
            
          }).
          error(function(data, status, headers, config) {
            
            $scope.saving = false;
            
            switch(status){
              
              case 403:
                
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',  
                  debug_data: status+ ' : ' + data,
                  config: config
                });
                
                break;
              
              case 404:
                
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',
                  debug_data: status+ ' : ' + data,
                  config: config
                });
                
                break;
                
              default:
              
                $scope.alerts.push({
                  message:'Unknown problem.',
                  level:'warning',
                  debug_data: 'user update' + ' : ' + status+ ' : ' + data,
                  config: config
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
ppdpControllers.controller('users', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$filter',
  function($scope, $routeParams, ppdpAPIService, $location, $filter) {
    console.log('users');
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    $scope.alerts = [];
    
    //users to be displaued in table
    $scope.users = [];
    $scope.users_loading = true;
    
    $scope.selected_users = [];
    $scope.rows_selected = false;
    $scope.show_paging = true;
    
    $scope.params = jQuery.extend(true, {offset:0,limit:10,query:''}, $routeParams );
    $scope.params.offset = parseInt($scope.params.offset);
    $scope.params.limit = parseInt($scope.params.limit);

    // set the directions to show up on page
    $scope.directions = [
    'Click individual Users to view their details',
    ];  

    /**
     * update_results() Updates document data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      //call retrieve api function
      $scope.users_loading = true;
      
      ppdpAPIService.user.retrieve($scope.params).
        success(function(data, status, headers, config) {

          //load data into users
          $scope.users = data;
          $scope.users_loading = false;
        }).
        error(function(data, status, headers, config) {

          $scope.users_loading = false;
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:'user retrieve' + ' : ' + status+ ' : ' + data
          });
        });
      
      //call retrieve api function get total num
      ppdpAPIService.user.totalNum($scope.params).
        success(function(data, status, headers, config) {
  
          //load data into users
          $scope.totalRows = data.total;
          console.log("user totalnum")
          console.log($scope.params);
          console.log(data);
          
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:'user retrieve total num' + ' : ' + status+ ' : ' + data
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
        text:'Date Added',
        value: function(row){
          var date = new Date(row.date_joined);
          date.setDate(date.getDate() + 1);
          return $filter('date')(date, "M/dd/yyyy");
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
      var i = 0;
      for(i = 0 ;i < $scope.users.length; i+=1){
        ppdpAPIService.toggle_select($scope.users,i);
        $scope.selected_users = ppdpAPIService.get_selected_subset($scope.users);
      }
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

/** Controller: test_panel */
ppdpControllers.controller('test_panel', ['$rootScope', '$scope', '$routeParams', 'ppdpAPIService', '$location',
  function($rootScope, $scope, $routeParams, ppdpAPIService, $location) {

  }]
);


