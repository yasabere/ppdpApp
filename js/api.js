var ppdpAPI = angular.module('ppdpAPI', []);
 
ppdpAPI.factory('ppdpAPIService', function($rootScope, $http, $location){
    var sharedService = {};

    sharedService.users = [];
    sharedService.documents = [];
    sharedService.assignments = [];
    sharedService.batches = [];
    sharedService.files = [];
    sharedService.roles = [];

    //classes
    function fileObj(){
      this.name = '';
      this.date_created = '11/5/2013 6:08 PM';
      this.entry_clerk = {first_name:"Jay", last_name: "Jennings"};
      this.file_size = "47kb";
    }

    function documentObj(){
      this.name = "document";
      this.abstract = '';
      this.newspaper = '';
      this.topic = "";
      this.type = "";
      this.date_created = '11/5/2013 6:08 PM';
      this.entry_clerk = {first_name:"Jay", last_name: "Jennings"};
      this.assigned = false;
      this.status = "unassigned";;

    }

    function batchObj(){
      this.name = "batch";
      this.date_created = '11/5/2013 6:08 PM';
      this.entry_clerk = {first_name:"Jay", last_name: "Jennings"};
      this.assigned = false;
      this.status = "";
    }

    function userObj(){
      this.first_name = "";
      this.last_name = "";
      this.date_joined = "";
      this.email = ""
      this.role = {role_id:2,name:"user"};
    }

    function assignmentObj(){
      this.user = {first_name:"John", last_name: "Doe"};
      this.type = {type_id : 1, name : "Data Entry"};
      this.file = {file_id:"2",name : "file 1"};
      this.date_created = "11/5/2013 6:08 PM";
      this.date_completed = "";
      this.date_due = "1/5/2014 6:08 PM";
      this.status = "Incomplete"
    }

    function roleObj(){
      this.role_id = 2;
      this.name = "User";
    }

    Array.prototype.randomElement = function () {
        return this[Math.floor(Math.random() * this.length)]
    }

    random_datetime =  function(){
      return  Math.ceil(Math.random() * 12) + '/' + Math.ceil(Math.random() * 29) + '/201' + Math.ceil(3 + Math.random() * 2) + ' ' + Math.ceil(Math.random() * 9) + ':' + Math.ceil(Math.random() * 5) + '' + Math.ceil(Math.random() * 9) + ' ' + ((Math.round(Math.random()))?"AM":"PM") ;
    }

    sharedService.userModel = function(){

      this.create = function(_user){
        sharedService.users.push(_user);
        return true;
      }

      this.retrieve = function(_user){
        return sharedService.users;
      }

      this.update = function(_user){

      }

      this.delete = function(_user){
        
      }
    }

    sharedService.assignmentModel = function(){
      this.create = function(_assignment){
        sharedService.assignments.push(_assignment);
        return true;
      }

      this.retrieve = function(_assignment){
        return sharedService.assignments;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }
    }

    sharedService.batchModel = function(){
      this.create = function(_batch){
        sharedService.batches.push(_batch);
        return true;
      }

      this.retrieve = function(batch){
        return sharedService.batches;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }
    }

    sharedService.documentModel = function(){
      this.create = function(_document){
        sharedService.documents.push(_document);
        return true;
      }

      this.retrieve = function(document){
        return sharedService.documents;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }
    }

    sharedService.fileModel = function(){
      this.create = function(_file){
        sharedService.files.push(_file);
        return true;
      }

      this.retrieve = function(_file){
        return sharedService.files;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }
    }

    sharedService.roleModel = function(){
      this.create = function(_role){
        sharedService.roles.push(_role);
        return true;
      }

      this.retrieve = function(_role){
        return sharedService.roles;
      }

      this.update = function(){

      }

      this.delete = function(){
        
      }
    }

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
    var _userModel = new sharedService.userModel()
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
    _document.name = "Philly area's smaller banks not hurrying to repay TARP funds";
    _document.abstract = "Banks nationwide have been able to repay most of the federal money they received from the 2008/2009 bailout effort. Many banks in Philadelphia are reluctant to sell new shares at depressed prices to repay the government investment. Bank executives have stated that small-bank gains came at the expense of larger and troubled banks";
    _document.newspaper = "Philadelphia Inquirer";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.name = "Turnpike tolls going up Sunday";
    _document.abstract = "Tolls on the PA Turnpike will soon increase 10 percent for cash customers and 3 percent for E-Zpass holders. A turnpike spokesperson said that travelers should expect regular increases as Act 44 mandates the turnpike to pay the PA Department of Transpiration to repair other highways. The turnpike wastes an annual $50,000 on unused tickets";
    _document.newspaper = "Bucks County Courier Time";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.name = "Task force wants funding for libraries put before voters";
    _document.abstract = "Court Judge Frank Lucchino, chairman of the Carnegie Library's Public Private Task Force, has suggested that the issue of closing Pittsburgh area library branches should be put to a vote. This comes after the public showed great opposition to the closing of Carnegie Library of Pittsburgh. Voters would decide how to fund libraries.";
    _document.newspaper = "Pittsburgh Tribune Review";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.name = "Coming soon: Nightmare on area streets";
    _document.abstract = "A Spokesman from the White House Council of Economic Advisers has warned of catastrophic consequences that will result if Republicans follow through on threats to reject an increase in the nation's borrowing limit. The US Treasury Department has estimated that the limit will be reached during the first or second quarter of FY 2011. US";
    _document.newspaper = "Reuters";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.name = 'Computers That See You and Keep Watch Over You';
    _document.abstract = "A series of articles examining the advances in artificial intelligence and robotics and their potential impact on society: Prison guards are now being assisted by smart video technology, which can pinpoint when and where potential disturbances between inmates are occurring. Some computers can read a man's face to determine his heart rate.";
    _document.newspaper = "New York Times";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.name = "State collects $191M more than expected in December";
    _document.abstract = "Pennsylvania Gov. Ed Rendell says the state collected $191.2 million more than expected in revenue in December 2010. Collections in every major tax category surpassed expectations. Rendell said that Governor Elect Tom Corbett will still have very tough decisions to make due to rising costs related to corrections, pensions and Medicaid.";
    _document.newspaper = "Associated Press";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.name = "Are Americans Wusses or Just Fond of Trash Talk?";
    _document.abstract = 'US President Barack Obama was recently lambasted for killing a house fly with his hands. PA Governor Ed Rendell has called us a "nation of wussies," which raised a lot of eye brows. He now understands why this comment stung so much. In an interview Rendell recounts US history: "Our country was founded by risk-takers, an army of farmers';
    _document.newspaper = "Wall Street Journal";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.name = "Officials celebrate groundbreaking for two 'flex' buildings at Navy ";
    _document.abstract = 'Mayor of Philadelphia Michael Nutter, along with 2 members of Congress, were present at a groundbreaking ceremony for two buildings that totaled little more than 100,000 square feet. Such a small undertaking usually does not attract such high ranking officials, but this is the biggest project since May 2009. The buildings will be unique to';
    _document.newspaper = "Philadelphia Inquirer";
    _documentModel.create(_document);

    _document = new documentObj();
    _document.name = "Pittsburgh mentors, money fuel education";
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

    for (i=8; i > 0; i-=1){
      var _batch = new batchObj();
      var rand_int;
      _batch.name+=" "+i;
      _batch.date_created = '11/5/201' + Math.ceil(3 + Math.random() * 2) + ' 6:08 PM';
      rand_int = Math.ceil(Math.random() * (sharedService.users.length-1));
      _batch.entry_clerk = sharedService.users[ rand_int ];
      _batch.assigned = [true,false][Math.round(Math.random() * 1)];
      _batch.status = batch_statuses.randomElement();
      _batchModel.create(_batch);
    }

    return sharedService;
});