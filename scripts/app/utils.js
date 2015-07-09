define(
       //Module Name
       "app/utils",

       //Dependancy Array
       ["app/config"],

       //Function to execute after deps have loaded.
       //Arguments to function are array of deps above.
       function(AppConfig){

       	//Define Module to be loaded into app namespace here
       	function Utils() {
       		this.log = function(msg){
  				AppConfig.logging_on ? 
  					console.log(msg) :
  					console.log(null);
       		};
       	}

       	return Utils;

       }
);