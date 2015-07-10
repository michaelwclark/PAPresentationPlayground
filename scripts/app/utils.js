require(
       //Module Name
       // "utils",

       //Dependancy Array
       ["config"],

       //Function to execute after deps have loaded.
       //Arguments to function are array of deps above.
       function(AppConfig){
       	console.log("AppUtils Loaded");
       	//Define Module to be loaded into app namespace here
       	var AppUtils = {
       		log : function(msg) {
  				AppConfig.logging_on ? 
  					console.log(msg) :
  					console.log(null);
				return null;
       		}       		
       	};

       	return AppUtils;
       }
);