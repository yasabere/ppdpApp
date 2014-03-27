//Global Settings

//Variable which sets whether mock api is avaiable for use
var enable_mock_api = false;

//link to live server api
var api_url_array = {
  stem:"http://np-stem.tu.temple.edu/cis4396-S02/api/",
  localtest:'http://localhost:26087/api/',
  };

var api_url_string = api_url_array['localtest'];

//object containing name of each resource which tells whether the js api should access live server api_url_string or mock api
var resources = {
  'account' : {use_mock:false},
  'assignment' : {use_mock:false}, 
  'batch' : {use_mock:false},
  'document' : {use_mock:false},
  'file' : {use_mock:false}, 
  'newspaper' : {use_mock:false}, 
  'role' : {use_mock:false}, 
  'user' : {use_mock:false},
  };

/**
 * api_url() returns the url to the server depending on the url settings
 * 
 * @param  <string> resource_name
 * @return <string> url
 */
var api_url = function(resource_name){
  return (resources[resource_name].use_mock && enable_mock_api)?'':api_url_string;
};

//'ngMockE2E'
var ppdpAPI = angular.module('ppdpAPI', []);//'ngMockE2E'
 
 //register ppdpAPIService
ppdpAPI.factory('ppdpAPIService', function($rootScope, $http, $location, $q){
    
    console.log("loaded");
    
    // Global Variables
    var sharedService = {};
    sharedService.users = [];
    sharedService.documents = [];
    sharedService.assignments = [];
    sharedService.batches = [];
    sharedService.files = [];
    sharedService.roles = [];
    sharedService.newspapers = [];
    
    /** Private functions */
    Array.prototype.randomElement = function () {
        return this[Math.floor(Math.random() * this.length)]
    }

    var random_datetime =  function(){
      return  Math.ceil(Math.random() * 12) + '/' + Math.ceil(Math.random() * 29) + '/201' + Math.ceil(3 + Math.random() * 2) + ' ' + Math.ceil(Math.random() * 9) + ':' + Math.ceil(Math.random() * 5) + '' + Math.ceil(Math.random() * 9) + ' ' + ((Math.round(Math.random()))?"AM":"PM") ;
    }

    /** Object Classes */
    function assignmentObj(){
      this.id = 2;
      this.users = [{first_name:"John", last_name: "Doe"}];
      this.type = {id : 1, name : "Data Entry"};
      this.file = {id:"2",name : "file 1", url:''};
      this.doc = {id:3};
      this.batch = {id:2};
      this.date_created = "11/5/2013 6:08 PM";
      this.date_completed = "";
      this.date_due = "1/5/2014 6:08 PM";
      this.creator = {first_name:"John", last_name: "Doe"};
      this.assigned = true;
    }
    
    function batchObj(){
      this.name = "batch";
      this.date_created = '11/5/2013 6:08 PM';
      this.entry_clerk = {first_name:"Jay", last_name: "Jennings"};
      this.assigned = false;
      this.status = "";
    }
    
    function documentObj(){
      this.headline = "document";
      this.abstract = '';
      this.newspaper = '';
      this.topic = "";
      this.type = "";
      this.date = "";
      this.date_created = '11/5/2013 6:08 PM';
      this.entry_clerk = {first_name:"Jay", last_name: "Jennings"};
      this.assigned = false;
      this.status = "unassigned";;
    }
    
    function fileObj(){
      this.name = '';
      this.date_created = '11/5/2013 6:08 PM';
      this.entry_clerk = {first_name:"Jay", last_name: "Jennings"};
      this.file_size = "47kb";
    }
    
    function newspaperObj(){
      
    }
    
    function roleObj(){
      this.role_id = 2;
      this.name = "User";
    }
    
    function userObj(){
      this.first_name = "";
      this.last_name = "";
      this.date_joined = "";
      this.email = ""
      this.role = {role_id:2,name:"user"};
    }

    /** Service Functions */
    
    /**
     * get_selected_subset() returns a subset of an arraylist
     * based on the one passed in '_array'
     * where property selected == true 
     *
     * @param <Array> _array
     * @return <Array> subset_array
     */
    sharedService.get_selected_subset = function(_array) {
        
        var subset_array = [];
        
        for (var i=0, l=_array.length; i<l; i++) {
          if (_array[i].selected === true){
            subset_array.push(_array[i]);
          }
        }
        
        return subset_array;
    }
    
    /**
     * get_selected_subset() toggles property selected (true/false)
     * of object of array _array using index 
     *
     * @param <Array> _array
     * @param <Number> index
     * @return <Array> subset_array
     */
    sharedService.toggle_select = function(_array,index){
      
      //if(typeof _array[index]['selected'] == 'undefined') {
        if (_array[index]['selected']){
         _array[index]['selected'] = false;
        }
        else{
          _array[index]['selected'] = true;
        }
    }

    /** Model Functions */
    //$http.defaults.useXDomain = true;
    
    sharedService.assignmentModel = function(){
      this.create = function(_assignment){
        var request = {
          method: 'POST',
          url: api_url('assignment') + 'assignment/create',
          data: "'" + JSON.stringify(_assignment) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);

      }

      this.retrieve = function(_assignment){
        var request = {
          method: 'GET',
          url: api_url('assignment') + 'assignment/retrieve',
          params: _assignment,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request); 
  
      }

      this.update = function(_assignment){
        var request = {
          method: 'POST',
          url: api_url('assignment') + 'assignment/update',
          params: "'" + JSON.stringify(_assignment) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.delete = function(_assignment){
        var request = {
          method: 'Delete',
          url: api_url('assignment') + 'assignment/delete',
          data: "'" + JSON.stringify(_assignment) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.totalNum = function(params){
        
        params = jQuery.extend(true, {}, params);
        
        params['totalnum'] = true;
        params['limit'] = 1000000;
        params['offset'] = 0;
        
        var request = {
          method: 'GET',
          url: api_url('document') + 'assignment/retrieve',
          params: params,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
      
    }
    sharedService.assignment = new sharedService.assignmentModel();

    sharedService.batchModel = function(){
      this.create = function(_batch){
        var request = {
          method: 'POST',
          url: api_url('batch') + 'batch/create',
          data: "'" + JSON.stringify(_batch) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.retrieve = function(_batch){
        var request = {
          method: 'GET',
          url: api_url('batch') + 'batch/retrieve',
          params: _batch,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.update = function(_batch){
        var request = {
          method: 'POST',
          url: api_url('batch') + 'batch/update',
          data: _batch,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.delete = function(_batch){
        var request = {
          method: 'Delete',
          url: api_url('batch') + 'batch/delete',
          data: "'" + JSON.stringify(_batch) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);  
      }
      
      this.totalNum = function(params){

        params = jQuery.extend(true, {}, params);
        
        params['totalnum'] = true;
        params['limit'] = 1000000;
        params['offset'] = 0;
        
        var request = {
          method: 'GET',
          url: api_url('batch') + 'batch/retrieve',
          params: params,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
      
      this.adddocument = function(params){
        var request = {
          method: 'GET',
          url: api_url('batch') + 'batch/adddocument',
          params: params,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
      
      this.removedocument = function(params){
        var request = {
          method: 'GET',
          url: api_url('batch') + 'batch/removedocument',
          data: params,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
    }
    sharedService.batch = new sharedService.batchModel();

    sharedService.documentModel = function(){
      this.create = function(_document){
        
        //TODO: Will be removed by server processes
        var now = new Date();
        var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");
        function AddZero(num) {
            return (num >= 0 && num < 10) ? "0" + num : num + "";
        }
        
        sharedService.user.retrieve({id:1}).
          success(function(data, status) {
            _document.entry_clerk = data[0];
          });
          
        _document.date_created = strDateTime;
        
        var request = {
          method: 'POST',
          url: api_url('document') + 'document/create',
          data:  "'" + JSON.stringify(_document) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.retrieve = function(_doc){
          
        var request = {
          method: 'GET',
          url: api_url('document') + 'document/retrieve',
          params: _doc,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.update = function(_doc){
        
        var request = {
          method: 'POST',
          url: api_url('document') + 'document/update',
          data: _doc,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.delete = function(_doc){
        var request = {
          method: 'Delete',
          url: api_url('document') + 'document/delete',
          data: "'" + JSON.stringify(_doc) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
      
      this.totalNum = function(params){
        
        params = jQuery.extend(true, {}, params);
        
        params['totalnum'] = true;
        params['limit'] = 1000000;
        params['offset'] = 0;
        
        var request = {
          method: 'GET',
          url: api_url('document') + 'document/retrieve',
          params: params,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
      
    };
    sharedService.doc = new sharedService.documentModel();

    sharedService.fileModel = function(){
      this.create = function(_file){
        
        var request = {
          method: 'POST',
          url: api_url('file') + 'file/create',
          data: _file,
          headers: {'Content-Type': 'multipart/form-data' }
        };
        
        return $http(request);
      }

      this.retrieve = function(_file){
          
        var request = {
          method: 'GET',
          url: api_url('file') + 'file/retrieve',
          params: _file,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.update = function(_file){
        var request = {
          method: 'POST',
          url: api_url('file') + 'file/update',
          data:  "'" + JSON.stringify(_file) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.delete = function(_file){
        var request = {
          method: 'DELETE',
          url: api_url('file') + 'file/delete',
          data:  "'" + JSON.stringify(_file) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
      
      this.totalNum = function(params){
        
        params = jQuery.extend(true, {}, params);
        
        params['totalnum'] = true;
        params['limit'] = 1000000;
        params['offset'] = 0;
        
        var request = {
          method: 'GET',
          url: api_url('file') + 'file/retrieve',
          params: params,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
    }
    sharedService.file = new sharedService.fileModel();
    
    sharedService.newspaperModel = function(){
      this.create = function(_newspaper){
        var request = {
          method: 'POST',
          url: api_url('newspaper') + 'newspaper/create',
          data: _newspaper,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.retrieve = function(_newspaper){
        var request = {
          method: 'GET',
          url: api_url('newspaper') + 'newspaper/retrieve',
          params: _newspaper,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.update = function(_newspaper){
        var request = {
          method: 'POST',
          url: api_url('newspaper') + 'newspaper/update',
          data: _newspaper,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.delete = function(_newspaper){
        var request = {
          method: 'Delete',
          url: api_url('newspaper') + 'newspaper/delete',
          data: _newspaper,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
    }
    sharedService.newspaper = new sharedService.newspaperModel();

    sharedService.roleModel = function(){
      this.create = function(_role){
        var request = {
          method: 'POST',
          url: api_url('role') + 'role/create',
          data: _role,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      };

      this.retrieve = function(_role){
        var request = {
          method: 'GET',
          url: api_url('role') + 'role/retrieve',
          params: _role,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      };
    };
    sharedService.role = new sharedService.roleModel();
    
    sharedService.userModel = function(){

      this.create = function(_user){
        var request = {
          method: 'POST',
          url: api_url('user') + 'user/create',
          data: "'" + JSON.stringify(_user) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        //console.log('body: ', JSON.stringify(_user));
        
        return $http(request);
      }

      this.retrieve = function(_user){

        var request = {
          method: 'GET',
          url: api_url('user') + 'user/retrieve',
          params: _user,
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }

      this.update = function(_user){
        var request = {
          method: 'PUT',
          url: api_url('user') + 'user/update',
          data: "'" + JSON.stringify(_user) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
      
      this.totalNum = function(params){
        
        params = jQuery.extend(true, {}, params);
        
        params['totalnum'] = true;
        params['limit'] = 1000000;
        params['offset'] = 0;
      
        var request = {
          method: 'GET',
          url: api_url('user') + 'user/retrieve',
          params: params,
          headers: {'Content-Type': 'application/json'}
        };
        
        console.log(request);
        
        return $http(request);
      }
    }
    sharedService.user = new sharedService.userModel();
    
    sharedService.accountModel = function(){
        
      this.login = function(_account){
        var request = {
          method: 'POST',
          url: api_url('account') + 'account/login',
          data: "'" + JSON.stringify(_account) + "'",
          headers: {'Content-Type': 'application/json'}
        };
        
        return $http(request);
      }
      
      this.logout = function(_account){
        var request = {
          method: 'GET',
          url: api_url('account') + 'account/logout',
        };
        
        return $http(request);
      }
      
      this.isloggedin = function(){
        var request = {
          method: 'GET',
          url: api_url('account') + 'account/getcurrentuser',
        };
        
        return $http(request);
      }

    }
    sharedService.account = new sharedService.accountModel();
    
    return sharedService;
});


//fake backend for unit testing
if (enable_mock_api){
  ppdpAPI.run(function($httpBackend, $filter) {
    
    //allow all template pages to not be intercepted by httpbackend
    var i = 0;
    var templates = [
      'alerts',
      'assignments',
      'autosuggest',
      'batch',
      'batches',
      'create_newsclip',
      'dropdown',
      'files',
      'footer',
      'header',
      'login',
      'newsclip',
      'newsclips',
      'searchable_dropdown',
      'sidebarmenu',
      'table',
      'tie_break_newsclip',
      'topmenu',
      'user',
      'users',
      ];
    
    //allow all api calls to not be intercepted by httpbackend  
    for(i = 0;i < templates.length;i+=1){
      $httpBackend.whenGET( 'templates/' + templates[i] + '.html').passThrough();
    }
    
    var controller_methods = {
        'account' : [
          'login',
          'logout',
          'isloggedin'
        ],
        'assignment' : [
          'create',
          'retrieve',
          'update',
          'delete',
          'totalnum'
        ],
        'batch' : [
          'create',
          'retrieve',
          'update',
          'delete',
          'totalnum',
          'adddocument',
          'removedocument'
        ],
        'document' : [
          'create',
          'retrieve',
          'update',
          'delete',
          'totalnum'
        ],
        'file' : [
          'create',
          'retrieve',
          'update',
          'delete',
          'totalnum'
          ],
        'newspaper' : [
          'create',
          'retrieve',
          'update',
          'delete',
          'totalnum'
        ],
        'role' : [
          'create',
          'retrieve',
          'update',
          'delete',
          'totalnum'
        ],
        'user' : [
          'create',
          'retrieve',
          'update',
          'delete',
          'totalnum'
        ]};
      
    for(var controller_method in controller_methods){
      
      for( var j = 0; j < controller_methods[controller_method].length; j+=1 ){
        
        var http_request_url = api_url_string + controller_method + '/' + controller_methods[controller_method][j];
        
        if (resources[controller_method].use_mock == false){
          $httpBackend.whenGET( http_request_url ).passThrough();
          //console.log(http_request_url);
        }
        
      }
      
    }
    
    //resource arrays
    var assignments = [];
    var batches = [];
    var documents = [];
    var files = [];
    var newspapers = [];
    var roles = [];
    var users = [];
    //var account = {password:''};
    var loggedinuser = {};
    var loggedin = false;
    
    //account
    $httpBackend.whenPOST('account/login').respond(function(method,url,data) {
      
      console.log(method);
      console.log(url);
      console.log(data);
      
      data = angular.fromJson(data);
      
      if (typeof data.password !== undefined && typeof data.username !== undefined){
        if(data.password == 'abc123' && data.username == 'admin@temple.edu'){
          
          loggedin = true;
          return [200, users[1], {}];
        }
        else{
          return [404, {error:'password not found'}, {}];
        }
      }
      
    });
    
    $httpBackend.whenGET('account/logout').respond(function(method,url,data) {
      loggedin = false;
      return [200, {}, {}];
    });
  
    //assignment
    $httpBackend.whenPOST('assignment/create').respond(function(method,url,data) {
      console.log("Creating assignment");
      data = angular.fromJson(data);
      data.id = assignments.length;
      assignments.push(data);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('assignment/retrieve').respond(function(method,url,data) {
      console.log("Retrieving assignment");
      
      var return_data = assignments.slice(0);
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      if (data.id){
        return_data = $filter('filter')(return_data,{id:data.id} );
      }
      else{
        
        if ( data.offset !== undefined){
          offset = data.offset;
        }
        
        if ( data.limit !== undefined){
          limit = data.limit;
        }
        
        if ( data.query !== undefined){
          return_data = $filter('filter')(return_data,data.query );
        }
        
        return_data = return_data.slice(offset,offset+limit);
        
      }
      
      console.log(return_data);
      
      return [200, return_data, {}];
    });
    
    $httpBackend.whenPOST('assignment/update').respond(function(method,url,data) {
      console.log("Updating assignment");
      data = angular.fromJson(data);
      assignments[data.id] = data;
      return [200, {}, {}];
    });
    
    $httpBackend.whenDELETE('assignment/delete').respond(function(method,url,data) {
      console.log("Deleting assignment");
      
      assignments.splice(assignments[angular.fromJson(data).id], 1);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('assignment/totalnum').respond(function(method,url,data) {
      console.log("Retrieving total num");
      
      var return_data = assignments.slice(0);
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      console.log(data);
      
      if ( typeof data.query !== undefined){
        return_data = $filter('filter')(return_data,data.query );
      }
  
      console.log(data);
  
      return [200, {total : return_data.length}, {}];
    });
    
    //batch
    $httpBackend.whenPOST('batch/create').respond(function(method,url,data) {
      console.log("Creating batch");
      data = angular.fromJson(data);
      data.id = batches.length;
      batches.push(data);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('batch/retrieve').respond(function(method,url,data) {
      console.log("Retrieving batch");
      
      var return_data = batches.slice(0);
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      if (data.id){
        return_data = $filter('filter')(return_data,{id:data.id} );
      }
      else{
        
        if ( data.offset !== undefined){
          offset = data.offset;
        }
        
        if ( data.limit !== undefined){
          limit = data.limit;
        }
        
        if ( data.query !== undefined){
          return_data = $filter('filter')(return_data,data.query );
        }
        
        return_data = return_data.slice(offset,offset+limit);
        
      }
      
      console.log(return_data);
      
      return [200, return_data, {}];
    });
    
    $httpBackend.whenPOST('batch/update').respond(function(method,url,data) {
      console.log("Updating batch");
      data = angular.fromJson(data);
      batches[data.id] = data;
      return [200, {}, {}];
    });
    
    $httpBackend.whenDELETE('batch/delete').respond(function(method,url,data) {
      console.log("Deleting document");
      
      batches.splice(documents[angular.fromJson(data).id], 1);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('batch/totalnum').respond(function(method,url,data) {
      console.log("Retrieving total num");
      
      var return_data = batches.slice(0);
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      console.log(data);
      
      if ( typeof data.query !== undefined){
        return_data = $filter('filter')(return_data,data.query );
      }
  
      console.log(data);
  
      return [200, {total : return_data.length}, {}];
    });
    
    //document
    
    $httpBackend.whenPOST('document/create').respond(function(method,url,data) {
      console.log("Creating document");
      data = angular.fromJson(data);
      data.id = documents.length;
      documents.push(data);
      return [200, data, {}];
    });
    
    $httpBackend.whenGET('document/retrieve').respond(function(method,url,data) {
      console.log("Retrieving document");
      
      var return_data = documents.slice(0);
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      if (data.id){
        return_data = $filter('filter')(return_data,{id:data.id} );
      }
      else{
        
        if ( data.offset !== undefined){
          offset = data.offset;
        }
        
        if ( data.limit !== undefined){
          limit = data.limit;
        }
        
        if ( data.query !== undefined){
          return_data = $filter('filter')(return_data,data.query );
        }
        
        return_data = return_data.slice(offset,offset+limit);
        
      }
      
      console.log(return_data);
      
      return [200, return_data, {}];
    });
    
    $httpBackend.whenPOST('document/update').respond(function(method,url,data) {
      console.log("Updating document");
      data = angular.fromJson(data);
      documents[data.id] = data;
      return [200, {}, {}];
    });
    
    $httpBackend.whenDELETE('document/delete').respond(function(method,url,data) {
      console.log("Deleting document");
      
      documents.splice(documents[angular.fromJson(data).id], 1);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('document/totalnum').respond(function(method,url,data) {
      console.log("Retrieving total num");
      
      var return_data = documents.slice(0);
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      console.log(data);
      
      if ( typeof data.query !== undefined){
        return_data = $filter('filter')(return_data,data.query );
      }
  
      console.log(data);
  
      return [200, {total : return_data.length}, {}];
    });
    
    //file
    $httpBackend.whenPOST('file/create').respond(function(method,url,data) {
      console.log("Creating file");
      data = angular.fromJson(data)
      data.id = files.length;
      files.push(data);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('file/retrieve').respond(function(method,url,data) {
      console.log("Retrieving files");
      
      var return_data = files.slice(0);
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      if (data.id){
        return_data = $filter('filter')(return_data,{id:data.id} );
      }
      else{
        
        if ( data.offset !== undefined){
          offset = data.offset;
        }
        
        if ( data.limit !== undefined){
          limit = data.limit;
        }
        
        if ( data.query !== undefined){
          return_data = $filter('filter')(return_data,data.query );
        }
        
        return_data = return_data.slice(offset,offset+limit);
        
      }
      
      console.log(return_data);
      
      return [200, return_data, {}];
    });
    
    $httpBackend.whenPOST('file/update').respond(function(method,url,data) {
      console.log("Updating file");
      data = angular.fromJson(data)
      files[data.id] = data;
      return [200, {}, {}];
    });
    
    $httpBackend.whenDELETE('file/delete').respond(function(method,url,data) {
      console.log("Deleting file");
      
      for(var i = 0; i < files.length ;i +=1){
        if (files[i].id == angular.fromJson(data).id){
          files.splice(i, 1);
        }
      }
      
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('file/totalnum').respond(function(method,url,data) {
      console.log("Retrieving total num");
      
      var return_data = files.slice(0);
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      console.log(data);
      
      if ( typeof data.query !== undefined){
        return_data = $filter('filter')(return_data,data.query );
      }
  
      console.log(data);
  
      return [200, {total : return_data.length}, {}];
    });
    
    //newspaper
    $httpBackend.whenPOST('newspaper/create').respond(function(method,url,data) {
      console.log("Creating newspaper");
      data = angular.fromJson(data)
      data.id = newspapers.length;
      newspapers.push(data);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('newspaper/retrieve').respond(function(method,url,data) {
      console.log("Retrieving newspaper");
      
      var return_data = newspapers;
      
      data = angular.fromJson(data)
      
      if (data.id){
        return_data = return_data.slice(data.id,data.id+1);
      } 
      
      console.log(return_data);
      
      return [200, return_data, {}];
    });
    
    $httpBackend.whenPOST('newspaper/update').respond(function(method,url,data) {
      console.log("Updating newspaper");
      data = angular.fromJson(data)
      newspapers[data.id] = data;
      return [200, {}, {}];
    });
    
    $httpBackend.whenDELETE('newspaper/delete').respond(function(method,url,data) {
      console.log("Deleting newspaper");
      
      newspapers.splice(newspapers[angular.fromJson(data).id], 1);
  
      return [200, {}, {}];
    });
    
    //role
    $httpBackend.whenPOST('role/create').respond(function(method,url,data) {
      console.log("Creating role");
      data = angular.fromJson(data)
      data.id = roles.length;
      roles.push(data);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('role/retrieve').respond(function(method,url,data) {
      console.log("Retrieving role");
      
      var return_data = roles;
      
      data = angular.fromJson(data)
      
      if (data.id){
        return_data = return_data.slice(data.id,data.id+1);
      } 
      
      console.log(return_data);
      
      return [200, return_data, {}];
    });
    
    $httpBackend.whenPOST('role/update').respond(function(method,url,data) {
      console.log("Updating role");
      data = angular.fromJson(data)
      roles[data.id] = data;
      return [200, {}, {}];
    });
    
    $httpBackend.whenDELETE('role/delete').respond(function(method,url,data) {
      console.log("Deleting role");
      
      roles.splice(roles[angular.fromJson(data).id], 1);
      return [200, {}, {}];
    });
    
    //user
    $httpBackend.whenPOST('user/create').respond(function(method,url,data) {
      console.log("Creating user");
      data = angular.fromJson(data)
      data.id = users.length;
      users.push(data);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('user/retrieve').respond(function(method,url,data) {
      console.log("Retrieving user");
      
      var return_data = users.slice(0);
      
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      if (data.id){
        return_data = $filter('filter')(return_data,{id:data.id} );
      }
      else{
        
        if ( data.offset !== undefined){
          offset = data.offset;
        }
        
        if ( data.limit !== undefined){
          limit = data.limit;
        }
        
        if ( data.query !== undefined){
          return_data = $filter('filter')(return_data,data.query );
        }
        
        return_data = return_data.slice(offset,offset+limit);
        
      }
      
      console.log(return_data);
      
      return [200, return_data, {}];
    });
    
    $httpBackend.whenPUT('user/update').respond(function(method,url,data) {
      console.log("Updating user");
      data = angular.fromJson(data)
      users[data.id] = data;
      return [200, {}, {}];
    });
    
    $httpBackend.whenDELETE('user/delete').respond(function(method,url,data) {
      console.log("Deleting user");
      
      users.splice(users[angular.fromJson(data).id], 1);
      return [200, {}, {}];
    });
    
    $httpBackend.whenGET('user/totalnum').respond(function(method,url,data) {
      console.log("Retrieving total num");
      
      var return_data = users.slice(0);
      var offset = 0;
      var limit = 50;
      
      data = angular.fromJson(data);
      
      console.log(data);
      
      if ( typeof data.query !== undefined){
        return_data = $filter('filter')(return_data,data.query );
      }
  
      console.log(data);
  
      return [200, {total : return_data.length}, {}];
    });
  
  });
}

