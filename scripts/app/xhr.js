function XHRHelper(){
	JSONRequest: function(url, method){
		var request = new XMLHttpRequest();
		request.open(method, url, true);

		request.onload = function(){
			if(request.status >= 200 && request.status < 400){
				return JSON.parse(request.responseText);				
			} else{
				//Server returned error. Handle appropriately
			}
		};

		request.onerror = function(){
			//Connection error, Handle it.
		};

		request.send();
	};

	AjaxPost: function(url,data, header){
		var request = new XMLHttpRequest();
		request.open('POST', url, true);
		if(typeof header == undefined || header.length == 0 ){
			request.setRequestHeader('Content-Type','applicationx-www-form-urlencoded; charset=UTF-8');
		} else {
			request.setRequestHeader('Content-Type',header);
		}
		request.send(data);
	};

	AjaxGet: function(url){
		var request = new XMLHttpRequest();
		request.open('GET', url', true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		    var resp = request.responseText;
		  } else {
		    // We reached our target server, but it returned an error
		    
		  }
		};

		request.onerror = function() {
		  // There was a connection error of some sort
		};

		request.send();
	
	}

}