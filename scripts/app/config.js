require(
       //Module Name
       // "config",

       //Dependancy Array
       [],

       //Function to execute after deps load
       function(){
		console.log("AppConfig Loaded");
       	//Config Module holds application config variables.
       	return  {
       		logging_on : true
       	};
       }
);