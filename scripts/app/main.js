define(function(require) {

        //Dependancy Loading
        var $ = require('jquery'),
        	AppConfig = require('config'),
        	AppUtils = require('utils');


        //Function to execute after DOM load
	   $(function(AppUtils){
	   	var utils = new AppUtils()
   		console.log("Main loaded");
   		console.log(AppUtils);
		AppUtils.log("Main Module Loaded.");
	   });        
});
