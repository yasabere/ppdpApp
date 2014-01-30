var ppdpAPI = angular.module('ppdpAPI', []);
 
 //registers ppdpAPIService
ppdpAPI.factory('ppdpAPIService', function($rootScope, $http, $location,$q){
    
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
      this.user = {first_name:"John", last_name: "Doe"};
      this.type = {type_id : 1, name : "Data Entry"};
      this.file = {file_id:"2",name : "file 1"};
      this.date_created = "11/5/2013 6:08 PM";
      this.date_completed = "";
      this.date_due = "1/5/2014 6:08 PM";
      this.status = "Incomplete"
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
      if (_array[index]['selected']){
       _array[index]['selected'] = false;
      }
      else{
        _array[index]['selected'] = true;
      }
     
    }

    /** Model Functions */
    sharedService.assignmentModel = function(){
      this.create = function(_assignment){
        sharedService.assignments.push(_assignment);

        return true;
      }

      this.retrieve = function(_assignment){
        console.log(sharedService.assignments[0]);
        return sharedService.assignments;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }

      
      
    }
    sharedService.assignment = new sharedService.assignmentModel();

    sharedService.batchModel = function(){
      this.create = function(_batch){
        sharedService.batches.push(_batch);
        return true;
      }

      this.retrieve = function(batch){
        console.log(sharedService.batches[0]);
        return sharedService.batches;
      }

      this.update = function(){

      }

      this.delete = function(){
        
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
        
        _document.entry_clerk = sharedService.users[1];
        _document.date_created = strDateTime;
        
        sharedService.documents.push(_document);
        
        return true;
      }

      this.retrieve = function(_doc){
          
        if (_doc.id){
            return sharedService.documents.slice(_doc.id,_doc.id+1);
        }   
          
        console.log(sharedService.documents[0]);
        return sharedService.documents;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }
    }
    sharedService.doc = new sharedService.documentModel();

    sharedService.fileModel = function(){
      this.create = function(_file){
        sharedService.files.push(_file);
        return true;
      }

      this.retrieve = function(_file){
          
        if (_file.id){
            return sharedService.files.slice(_file.id,_file.id+1);
        } 
          
        console.log(sharedService.files[0]);
        return sharedService.files;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }
    }
    sharedService.file = new sharedService.fileModel();
    
    sharedService.newspaperModel = function(){
      this.create = function(_newspaper){
        sharedService.newspapers.push(_newspaper);
        return true;
      }

      this.retrieve = function(query){
        console.log(sharedService.newspapers[0]);
        return sharedService.newspapers;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }
    }
    sharedService.newspaper = new sharedService.newspaperModel();

    sharedService.roleModel = function(){
      this.create = function(_role){
        sharedService.roles.push(_role);
        return true;
      }

      this.retrieve = function(_role){
        console.log(sharedService.roles[0]);
        return sharedService.roles;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }
    }
    sharedService.role = new sharedService.roleModel();
    
    sharedService.userModel = function(){

      this.create = function(_user){
        sharedService.users.push(_user);
        return true;
      }

      this.retrieve = function(_user){
          
        if (_user.id){
            return sharedService.users.slice(_user.id,_user.id+1);
        } 
          
        console.log(sharedService.users[0]);
        return sharedService.users;
      }

      this.update = function(_user){

      }

      this.delete = function(_user){
        
      }
    }
    sharedService.user = new sharedService.userModel();
    
    sharedService.accountModel = function(){
        
      this.login = function(_user){
        console.log(sharedService.users[0]);
        return sharedService.users;
      }

    }
    sharedService.account = new sharedService.accountModel();
    
    /** Temporary model data */
    //make roles for system
    var _roleModel = new sharedService.roleModel()
    var _role = new roleObj();
    _role.role_id = 1;
    _role.name = "Administrator";
    _roleModel.create(_role);

    var _role = new roleObj();
    _role.role_id = 2
    _role.name = "Sr. Researcher";
    _roleModel.create(_role);

    var _role = new roleObj();
    _role.role_id = 3;
    _role.name = "Researcher";
    _roleModel.create(_role);

    // make users for system
    var _userModel = new sharedService.userModel();
    var _user = new userObj();
    
    _user.first_name = "Jay";
    _user.last_name = "Jennings";
    _user.date_joined = random_datetime();
    _user.role = sharedService.roles[0];
    _userModel.create(_user);

    _user = new userObj();
    _user.first_name = "Yaw";
    _user.last_name = "Asabere";
    _user.date_joined = random_datetime();
    _user.email = "tub97573@temple.edu";
    _userModel.create(_user);

    _user = new userObj();
    _user.first_name = "Chris";
    _user.last_name = "S";
    _user.date_joined = random_datetime();
    _userModel.create(_user);

    _user = new userObj();
    _user.first_name = "Sandra";
    _user.last_name = "Trinh";
    _user.date_joined = random_datetime();
    _userModel.create(_user);

    _user = new userObj();
    _user.first_name = "Dave";
    _user.last_name = "Park";
    _user.date_joined = random_datetime();
    _userModel.create(_user);

    //make documents for system
    var _documentModel = new sharedService.documentModel();

    var statuses = ['Requires Tie-break', 'Requires coding', 'Requires 1 Code', "Complete","Published"]

    var _document = new documentObj();
    _document.headline = "Philly area's smaller banks not hurrying to repay TARP funds";
    _document.abstract = "Banks nationwide have been able to repay most of the federal money they received from the 2008/2009 bailout effort. Many banks in Philadelphia are reluctant to sell new shares at depressed prices to repay the government investment. Bank executives have stated that small-bank gains came at the expense of larger and troubled banks";
    _document.newspaper = "Philadelphia Inquirer";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.headline = "Turnpike tolls going up Sunday";
    _document.abstract = "Tolls on the PA Turnpike will soon increase 10 percent for cash customers and 3 percent for E-Zpass holders. A turnpike spokesperson said that travelers should expect regular increases as Act 44 mandates the turnpike to pay the PA Department of Transpiration to repair other highways. The turnpike wastes an annual $50,000 on unused tickets";
    _document.newspaper = "Bucks County Courier Time";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.headline = "Task force wants funding for libraries put before voters";
    _document.abstract = "Court Judge Frank Lucchino, chairman of the Carnegie Library's Public Private Task Force, has suggested that the issue of closing Pittsburgh area library branches should be put to a vote. This comes after the public showed great opposition to the closing of Carnegie Library of Pittsburgh. Voters would decide how to fund libraries.";
    _document.newspaper = "Pittsburgh Tribune Review";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.headline = "Coming soon: Nightmare on area streets";
    _document.abstract = "A Spokesman from the White House Council of Economic Advisers has warned of catastrophic consequences that will result if Republicans follow through on threats to reject an increase in the nation's borrowing limit. The US Treasury Department has estimated that the limit will be reached during the first or second quarter of FY 2011. US";
    _document.newspaper = "Reuters";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.headline = 'Computers That See You and Keep Watch Over You';
    _document.abstract = "A series of articles examining the advances in artificial intelligence and robotics and their potential impact on society: Prison guards are now being assisted by smart video technology, which can pinpoint when and where potential disturbances between inmates are occurring. Some computers can read a man's face to determine his heart rate.";
    _document.newspaper = "New York Times";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.headline = "State collects $191M more than expected in December";
    _document.abstract = "Pennsylvania Gov. Ed Rendell says the state collected $191.2 million more than expected in revenue in December 2010. Collections in every major tax category surpassed expectations. Rendell said that Governor Elect Tom Corbett will still have very tough decisions to make due to rising costs related to corrections, pensions and Medicaid.";
    _document.newspaper = "Associated Press";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.headline = "Are Americans Wusses or Just Fond of Trash Talk?";
    _document.abstract = 'US President Barack Obama was recently lambasted for killing a house fly with his hands. PA Governor Ed Rendell has called us a "nation of wussies," which raised a lot of eye brows. He now understands why this comment stung so much. In an interview Rendell recounts US history: "Our country was founded by risk-takers, an army of farmers';
    _document.newspaper = "Wall Street Journal";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.headline = "Officials celebrate groundbreaking for two 'flex' buildings at Navy ";
    _document.abstract = 'Mayor of Philadelphia Michael Nutter, along with 2 members of Congress, were present at a groundbreaking ceremony for two buildings that totaled little more than 100,000 square feet. Such a small undertaking usually does not attract such high ranking officials, but this is the biggest project since May 2009. The buildings will be unique to';
    _document.newspaper = "Philadelphia Inquirer";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.headline = "Pittsburgh mentors, money fuel education";
    _document.abstract = 'Pittsburgh police officer Tamara Davis loves to volunteer her time to kids in the Pittsburgh School Districts. She does this through a mentoring program, which eventually leads to a $40,000 scholarship over four years, which can be spent at any college or trade school in PA. The United Way of Allegheny County sponsors a similar program.';
    _document.newspaper = "USA Today";
    _documentModel.create(_document);

    sharedService.documents.forEach(function(_document) {
      var rand_int;
      _document.date_created = random_datetime()
      rand_int = Math.ceil(Math.random() * (sharedService.users.length-1));
      _document.entry_clerk = sharedService.users[ rand_int ];
      _document.assigned = [true,false][Math.round(Math.random() * 1)];
      _document.status = statuses.randomElement();
    });

    //make files for system
    var file_statuses = ['Requires Entry', "Complete"];
    var _fileModel = new sharedService.fileModel();

    for (i=8; i > 0; i-=1){
      var _file = new fileObj();
      var rand_int;
      _file.name+=" "+i;
      _file.date_created = random_datetime()
      rand_int = Math.ceil(Math.random() * (sharedService.users.length-1));
      _file.entry_clerk = sharedService.users[ rand_int ];
      _file.assigned = [true,false][Math.round(Math.random() * 1)];
      _file.file_size = (5 + Math.round(Math.random() * 4)) +""+ (1 + Math.round(Math.random() * 8)) + "kb";
      _file.status = file_statuses.randomElement();
      _fileModel.create(_file);
    }

    //make batches for the system
    var batch_statuses = ['Incomplete', 'Complete'];
    var _batchModel = new sharedService.batchModel();
    
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Nov',
      'Dec'
      ];

    for (i=8; i > 0; i-=1){
      var _batch = new batchObj();
      var rand_int;
      _batch.name= months[i];
      _batch.date_created = '11/5/201' + Math.ceil(3 + Math.random() * 2) + ' 6:08 PM';
      rand_int = Math.ceil(Math.random() * (sharedService.users.length-1));
      _batch.entry_clerk = sharedService.users[ rand_int ];
      _batch.assigned = [true,false][Math.round(Math.random() * 1)];
      _batch.status = batch_statuses.randomElement();
      _batchModel.create(_batch);
    }
    
    //make assignments for the system
    var assignment_statuses = ['Incomplete', 'Complete'];
    var _assignmentModel = new sharedService.assignmentModel();

    for (i=8; i > 0; i-=1){
      var _assignment = new assignmentObj();

      _assignment.name+=" "+i;
      _assignment.date_created = '11/5/201' + Math.ceil(3 + Math.random() * 2) + ' 6:08 PM';
      _assignment.date_due = random_datetime();
      rand_int = Math.ceil(Math.random() * (sharedService.users.length-1));
      _assignment.user = sharedService.users[ rand_int ];
      _assignment.assigned = [true,false][Math.round(Math.random() * 1)];
      _assignment.status = assignment_statuses.randomElement();
      _assignmentModel.create(_assignment);
    }
    
    //make newspapers for the syste
    var _newspaperModel = new sharedService.newspaperModel();

    var _newspaper = new  newspaperObj();
    _newspaper.id = sharedService.newspapers.length;
    _newspaper.name = "Philadelphia Inquirer";
    _newspaperModel.create(_newspaper);
    
    _newspaper = new  newspaperObj();
    _newspaper.id = sharedService.newspapers.length;
    _newspaper.name = "Bucks County Courier Time";
    _newspaperModel.create(_newspaper);
    
    _newspaper = new newspaperObj();
    _newspaper.id = sharedService.newspapers.length;
    _newspaper.name = "Pittsburgh Tribune Review";
    _newspaperModel.create(_newspaper);
    
    _newspaper = new  newspaperObj();
    _newspaper.id = sharedService.newspapers.length;
    _newspaper.name = "Reuters";
    _newspaperModel.create(_newspaper);
    
    _newspaper = new  newspaperObj();
    _newspaper.id = sharedService.newspapers.length;
    _newspaper.name = "New York Times";
    _newspaperModel.create(_newspaper);
    
    _newspaper = new  newspaperObj();
    _newspaper.id = sharedService.newspapers.length;
    _newspaper.name = "USA Today";
    _newspaperModel.create(_newspaper);
    
    return sharedService;
});