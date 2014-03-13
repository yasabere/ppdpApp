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
ppdpControllers.controller('assignments', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout',
  function($scope, $routeParams, ppdpAPIService, $location, $timeout) {
    console.log('assignments');
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    $scope.assignments = [];
    $scope.selected_assignments = [];
    $scope.alerts = [];
    $scope.rows_selected = false;
    $scope.totalRows = 0;
    
    $scope.params = {
      offset:0,
      limit:5,
      query:''
    }

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');
    
    /**
     * update_results() Updates assigment data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      //call retrieve api function
      ppdpAPIService.assignment.retrieve($scope.params).
        success(function(data, status) {

          //load data into assignments
          $scope.assignments = data;
        
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
          
          switch(status){
            case 401:
              $location.path('login');
            break;
          }
          
        });
      
      //call retrieve api function get total num
      ppdpAPIService.assignment.totalNum($scope.params).
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
      
      alert(JSON.stringify($scope.assignments[id]));
      
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
            level:'warning'
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
      $timeout(function(){
        $('.alert').bind('closed.bs.alert', function () {
          $scope.alerts = [];
        });
        $(".alert").alert('close');
      }, 2000);
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
ppdpControllers.controller('batch', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout',
  function($scope, $routeParams, ppdpAPIService, $location, $timeout) {
    console.log('batch');
    
    // Global variables for controller
    
    //batch to be shown on screen
    $scope.batch = {};
    
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
    
    //call retrieve api function
    ppdpAPIService.batch.retrieve({id:$routeParams.batchId}).
      success(function(data, status) {
        //load data into batch
        $scope.batch = data[0];
        $scope.title = "Batch " + $scope.batch.id + ' |';
        
      }).
      error(function(data, status) {
        $scope.alerts.push({
          message:'Trouble connecting to server.',
          level:'warning',
          debug_data:status+ ' : ' + data
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
      ppdpAPIService.batch.retrieve($scope.params).
        success(function(data, status) {
          //load data into batch
          $scope.batches = data;
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
    };
    
    $scope.update_batches();
    
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
    };
    
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

/** Controller: batches */
ppdpControllers.controller('batches', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout',
  function($scope, $routeParams, ppdpAPIService, $location, $timeout) {
    
    // Global variables for controller
    $scope.batches = [];
    $scope.users = [];
    $scope.selected_batches = [];
    $scope.alerts = [];
    $scope.rows_selected = false;
    $scope.totalRows = 0;
    $scope.assignment = {type:'',user:''};
    
    $scope.params = {
      offset:0,
      limit:5,
      query:''
    }

    // set the directions to show up on page
    $scope.directions = [];
    $scope.directions.push('Select batch(s) to "Assign", "Publish" or "Trash"');
    $scope.directions.push('Click batch to view its\' contents');
    
    /**
     * update_results() Updates batch data with new search 
     *
     * @return NULL
     */
    $scope.update_results = function(){
      //call retrieve api function
      ppdpAPIService.batch.retrieve($scope.params).
        success(function(data, status) {

          //load data into users
          $scope.batches = data;
          
        
        }).
        error(function(data, status) {
        $scope.alerts.push({
          message:'Trouble connecting to server.',
          level:'warning',
          debug_data:status+ ' : ' + data
        });
      });
      
      //call retrieve api function get total num
      ppdpAPIService.batch.totalNum($scope.params).
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
     * update_batches() Updates batches to be shown when batch
     *
     * @return NULL
     */
    $scope.update_users = function(){
      //call retrieve api function
      ppdpAPIService.user.retrieve($scope.params).
        success(function(data, status) {
          //load data into batch
          
          for(var i = 0;i < data.length; i+=1){
            $scope.users.push({name:data[i].first_name + ' ' + data[i].last_name, id:data[i].id});
          }
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
    }
    
    $scope.update_users();
    
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
      $location.path("/batch/"+(id+$scope.params.offset)).search($scope.params);
    }
    
    /**
     * delete() deletes selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.delete = function(){
      for(var i = 0; i < $scope.selected_batches.length; i+=1){
        ppdpAPIService.batch.delete($scope.selected_batches[i]);
        $scope.update_results();
      }
      $('#deleteModal').modal('hide');
      $scope.selected_batches = [];
    
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
    }
    
    /**
     * assign() creates new assignment
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.assign = function(){
      
      var success = true;
      
      for(var i = 0; i < $scope.selected_batches.length; i+=1){
        //ppdpAPIService.assignment.create($scope.selected_batches[i]);
        
        $scope.assignment.batch = $scope.batches[i];
        
        //create new request object to be sent to api
        var assignment_request = jQuery.extend( true, {},$scope.assignment);
        
        
        console.log($scope.assignment);
        
        ppdpAPIService.assignment.create(assignment_request).
          success(function(){
            success = true;
          }).
          error(function(data, status) {
            $scope.alerts.push({
              message:'Trouble connecting to server.',
              level:'warning',
              debug_data:status+ ' : ' + data
            });
          });
          
        $scope.update_results();
      }
      $('#assignModal').modal('hide');
      $scope.selected_batches = [];
    
      if (success){
        //if succesful show message to user
        $scope.alerts.push({
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
ppdpControllers.controller('create_newsclip', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout',
  function($scope, $routeParams, ppdpAPIService, $location, $timeout) {
    console.log('create_newsclip');
    
    //global variables
    $scope.saved = false;
    $scope.alerts = [];
    $scope.urgent_alerts = [];
    
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
            
            //update created document
            $scope.doc = data;
   
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
    
    /**
     * delete() deletes selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.delete = function(){
      //call update api function
      ppdpAPIService.doc.delete($scope.doc).
        success(function(data, status) {
 
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
        error(function(data, status) {
          
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
                debug_data:status+ ' : ' + data
              });
              
              break;
              
            default:
            
              $scope.urgent_alerts.push({
                message:'Unknown problem.',
                level:'warning',
                debug_data:status+ ' : ' + data
              });
            
              break;
          }
      });
    };
    
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
      
      if ($scope.returnObject === 'true'){
        $scope.ngModel = option;
      }
      else{
        $scope.ngModel = option[$scope.value_field];
      }
      
    };
  
  }]
);

/** Controller: files */
ppdpControllers.controller('files', ['$scope', '$routeParams', 'ppdpAPIService', '$location','$timeout',
  function($scope, $routeParams, ppdpAPIService, $location, $timeout) {
    
    // Global variables for controller
    
    // FIXME: currently have to instantiate
    $scope.files = [];
    $scope.users = [];
    $scope.selected_files = [];
    $scope.rows_selected = false;
    $scope.totalRows = 0;
    $scope.alerts = [];
    $scope.assignment = {type:'',user:''};
    
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
     * update_batches() Updates batches to be shown when batch
     *
     * @return NULL
     */
    $scope.update_users = function(){
      //call retrieve api function
      ppdpAPIService.user.retrieve($scope.params).
        success(function(data, status) {
          //load data into batch
          
          for(var i = 0;i < data.length; i+=1){
            $scope.users.push({name:data[i].first_name + ' ' + data[i].last_name, id:data[i].id});
          }
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
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

    /**
     * details() bring up file modal
     *
     * @param <String> index
     * @return NULL
     */
    $scope.details = function(id,option){
      $('#downloadModal').modal('toggle');
      $scope.downloadName = $scope.files[id].name;
      $scope.downloadLink = $scope.files[id].href;
    };
    
    /**
     * delete() deletes selected items
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.delete = function(){
      for(var i = 0; i < $scope.selected_files.length; i+=1){
        ppdpAPIService.file.delete($scope.selected_files[i]);
        $scope.update_results();
      }
      $('#deleteModal').modal('hide');
      $scope.selected_files = [];
      
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
     * assign() creates new assignment
     * 
     * @param <String> index
     * @return NULL
     */
    $scope.assign = function(){
      
      var success = true;
      
      //send a create request to api for each selected file
      for(var i = 0; i < $scope.selected_files.length; i+=1){

        $scope.assignment.file = $scope.files[i];
        
        //create new request object to be sent to api
        var assignment_request = jQuery.extend( true, {},$scope.assignment);
            
        //send create request to api
        ppdpAPIService.assignment.create(assignment_request).
          success(function(){
            success = true;
          }).
          error(function(data, status) {
            $scope.alerts.push({
              message:'Trouble connecting to server.',
              level:'warning',
              debug_data:status+ ' : ' + data
            });
            
          });
          
        $scope.update_results();
      }
      $('#assignModal').modal('hide');
      $scope.selected_batches = [];
    
      //of sucessful in creating assignments notify user
      if (success){
        //if succesful show message to user
        $scope.alerts.push({
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
        success(function(data, status){
          $rootScope.user_account = 'undefined';
          $location.path('login');
        }).
        error(function(data, status){
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
    
    /**
     * login() tries to log user in with specified account data from scope. 
     * If it was possible it changes page to assignments. If false it produces an alert saying
     * it failed
     * 
     * @param NULL
     * @returns NULL
     */
    $scope.login = function(){
      
      $scope.alerts = [];
      
      console.log($scope.login_form);
      
      //login_form
      if ($scope.login_form.$invalid){
        
        if ($scope.login_form.email.$valid == false){
          $scope.alerts.push({
            message: 'Valid Email Address is required.',
            level:'danger',
          });
        }
        
        if ($scope.login_form.password.$valid == false){
          $scope.alerts.push({
            message: 'Password is required.',
            level:'danger',
          });
        }

      }
      else{
        ppdpAPIService.account.login($scope.account).
          success(function(data, status){
            
            $rootScope.user_account = data;
            
            //show user alert stating they have successfully logged in
            $scope.alerts.push({
              message:'You have successfully logged in',
              level:'success',
            });
            
            //send user to assignments page
            $location.path('assignments');
          }).
          error(function(data, status){
            
            console.log(data);
            
            switch(status){
              case 404:
                $scope.alerts.push({
                  message:'No account with password was found.',
                  level:'danger'
                });
                break;
                
              default:
                $scope.alerts.push({
                  message:'Trouble connecting to server.',
                  level:'warning',
                  debug_data:status+ ' : ' + data
                });
                break;
            }
            
          });
      }
    }
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
        path:['/','/newsclips','/newsclip']
      },
      {
        title: 'Batches',
        href: 'batches',
        menu:[],
        path:['/batches','/batch']
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
ppdpControllers.controller('newsclip', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$http', '$timeout',
  function($scope, $routeParams, ppdpAPIService, $location, $http, $timeout) {
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
    
    $scope.assignment = {name:'Tiebreak', id:3};
    
    //variable to keep track of recently searched documents for navigation 
    $scope.documents = [];
    $scope.users = [];
    
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
    $scope.urgent_alerts = [];
    
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
              
              //if document needs tiebreak
              if(true){
                $scope.button_functions.push({
                  text : 'Assign',
                  glyphicon : 'folder-close',
                  function_callback : function(){$('#assignModal').modal('toggle')}, 
                });
              }
              
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
    
    /**
     * update_users() Updates list of users
     *
     * @return NULL
     */
    $scope.update_users = function(){
      //call retrieve api function
      ppdpAPIService.user.retrieve({}).
        success(function(data, status) {
          //load data into batch
          
          for(var i = 0;i < data.length; i+=1){
            $scope.users.push({name:data[i].first_name + ' ' + data[i].last_name, id:data[i].id});
          }
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
    }
    
    $scope.update_users();

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
      
      //call update api function
      ppdpAPIService.doc.update($scope.doc).
        success(function(data, status) {
 
          //if succesful show message to user
          $scope.alerts.push({
            message:'Save successful!',
            level:'success',
            debug_data: $scope.doc
            
          }); 
          
          console.log($scope.doc);
          
        }).
        error(function(data, status) {
          
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
      
    };
    
    $scope.delete = function(){
      //call update api function
      ppdpAPIService.doc.delete($scope.doc).
        success(function(data, status) {
 
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
        error(function(data, status) {
          
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
                debug_data:status+ ' : ' + data
              });
              
              break;
              
            default:
            
              $scope.urgent_alerts.push({
                message:'Unknown problem.',
                level:'warning',
                debug_data:status+ ' : ' + data
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
      
      //create new request object to be sent to api
      var assignment_request = jQuery.extend( true, {},$scope.assignment);
          
      //send create request to api
      ppdpAPIService.assignment.create(assignment_request).
        success(function(){
          success = true;
        }).
        error(function(data, status) {
          $scope.urgent_alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
          
        });
 
      $('#assignModal').modal('hide');
    
      //of sucessful in creating assignments notify user
      if (success){
        //if succesful show message to user
        $scope.alerts.push({
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
ppdpControllers.controller('newsclips', ['$scope', '$routeParams', 'ppdpAPIService', '$location', '$timeout',
  function($scope, $routeParams, ppdpAPIService, $location, $timeout) {
    console.log('newsclips');
    
    // Global variables for controller
    
    //newsclips to be shown in table
    $scope.documents = [];
    
    //batches to be shown in dropdown when adding to batch
    $scope.batches = [];
    
    //documents which bave been check boxed
    $scope.selected_documents = [];
    
    //alerts to be shown on screen
    $scope.alerts = [];
    
    //handle url parameters from previous page
    $scope.params = jQuery.extend(true, {offset:0,limit:5}, $routeParams );
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
        success(function(data, status) {
          //load data into batch
          $scope.batches = data;
          
        }).
        error(function(data, status) {
          $scope.alerts.push({
            message:'Trouble connecting to server.',
            level:'warning',
            debug_data:status+ ' : ' + data
          });
      });
    };
    
    $scope.update_batches();
    
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
    };
    
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
      
      console.log($scope.create_user_form);
      
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
              debug_data: $scope.user
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
    $scope.params.offset = parseInt($scope.params.offset);
    $scope.params.limit = parseInt($scope.params.limit);

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
