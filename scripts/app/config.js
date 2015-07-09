define(
       //Module Name
       "app/config",

       //Dependancy Array
       [],

       //Function to execute after deps load
       function(){

       	//Config Module holds application config variables.
       	function Config(){


       		this.logging_on = true;
       	}

       	return Config;

       }
);