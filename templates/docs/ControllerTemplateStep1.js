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