function PolkMapImage(args){ 
	var utils = new ApplicationUtilities();	

	//We dont want PolkMapImage to hold these defaults all the time, so I pulled this 
	//into it's own function to call on when needed.

	//var self = this.LoadDynamicArgs(args); //WILL FAIL, unless Object prototype code has been evaluated.
	var self = this.loadDefaults(); 

	loadDefaults : function(){
  		  // set default properties here
		  self.mapCgi = { value: 'http://doffub-next.assess.co.polk.ia.us/cgi-bin/off/maps/polkmapimage0', ui: 'none', label: 'CGI' };
		  self.mapfile= 'polk.map';
		  self.img_metadata = {};  // will hold mapserv query string key:values
		  self.zoomto = { value: 2640, ui: 'text', label: 'Width (feet)', 
		                  style: 'display: inline; width: 4em' };  // 1/2 mi width
		  self.zoomin = { src: 'http://doffub-next.assess.co.polk.ia.us/img/web/zoom_in.png', ui: 'image', title: 'Zoom In' };
		  self.zoomout= { src: 'http://doffub-next.assess.co.polk.ia.us/img/web/zoom_out.png', ui: 'image', title: 'Zoom Out' };
		  self.size   = { value: [640, 480], ui: 'text', label: 'Size (pixels)',
		                  style: 'width: 6em' };
		  self.layers = [{ name: 'Aerial_2014', isOn: false, ui: 'checkbox', label: 'Aerial'  },
		                 { name: 'parcel'     , isOn: true , ui: 'checkbox', label: 'Parcels' },
		                 { name: 'street'     , isOn: true , ui: 'checkbox', label: 'Streets' }
		  ];

			// The below properties all look to have the same composition. 
  			// Utilizing a reusable class could clean any other code up that utilizes this pattern.
  			// Same applies to any repeted parameters above (layers, zoomin/out, zoomto)

		  self.ndps   = { value: ['29100452571000','29100452572000','29100452573000'],
		                  ui: 'text', label: 'New DPs', style: 'display: inline' };
		  self.odps   = { value: ['29100452522003'], ui: 'text', label: 'Old DPs',
		                  style: 'display: inline' };
		  self.div    = { value: '201500500', ui: 'text', label: 'Division Sheet#',
		                  style: 'display: inline; width: 6em' };
		  self.dp     = { value: '29100452522003', ui: 'none', label: 'DP',
		                  style: 'display: inline' };
		  self.extent = { value: [], ui: 'text', label: 'Coordinates',
		                  style: 'display: inline; width: 16em' };
		  self.clickxy= { value: [], ui: 'text', label: 'Click XY',
		                  style: 'display: inline; width: 6em' };
		  self.click_lonlat = { value: [], ui: 'text', label: 'Click Lon/Lat',
		                  style: 'display: inline; width: 10em' };

            return self;
	};

	zoomtoRect : function(){
		var ret = new String();
		var wh = self.size.value;
		var zoomToVal = self.zoomto.value;
		var zh = Math.round(zoomToVal * wh[1] / wh[0]);
		//Here is a good example of how creating more structure objects can avoid errors.
		//right now PolkMapImg.zoomto is a dynamic runtime property with no validation or 
		//constraint. If this isn't set properly (i.e. containing an object with value property)
		//this function will error out and stop further execution (unless caught).
		return '0+0+' + zoomtoVal +'+' +zh; //This is faster than .join()
		// return [0,0,zoomToVal,zh].join('+');
		//consider utilizing builtin String.concat, a custom helper, or  the above 
		//(especially when these .join calls are nested)
	};

	imgUrl : function () { 
		// Another personal preference. Declare any local variables at the top of the scope.
		// this example is the start of the function.
		var layernames = [];
		var extras = [];
		var qstr;

		for (var i = self.layers.length - 1; i >= 0; i--) {
			layernames.push(layr.name) ? layr.isOn : continue;
			//This is just personal preference to utilize ternary for brevity.
			//Native for loop vs forEach yields ~40x speed increase.
		}


		//Gut feeling says pull this following section into it's own method.
		//Since self.keys is an array
		var keys = Object.keys(self); //Array of Object's keys.
		var regEx = new RegExp(/size|mapCgi|mapfile|layers|zoomto|odps|ndps|div|img_metadata/);
		//optimized for loop by nesting if, using RegExp object to utilize speed enhancments from
		//letting interpriter compile RegEx and utilize test vs search.
		// RegExp.prototype.test 30%-60% speed enhancment for just indexOf() style of testing.
		for (var i = keys.length - 1; i >= 0; i--) {
			//if Object's Key has length aka is Set, run regex, if match push to extra layers.
			if(keys[i].length > 0){  //I almost wonder if this length check is redundant with .test.
				// Any input here Jerry?
	//remove this parent IF
				extras.push(keys[i]) ? regEx.test(keys[i]) : continue;			
			}
		}

		for (var i = extras.length - 1; i >= 0; i--) {
			var key = extras[i];
			queryString.concat('&',key,'=',self[key]);
		}

		//build queryString
		return self.buildQueryString(layernames);
	};

	buildQueryString : function(layernames){ //this will be the object instance that called this method.
		var queryString = '&';
		var queryObj = {
			layers: layernames.join('+'),
			mapfile: self.mapfile,
			size: self.size.value.join('x'),
			rect: self.zoomtoRect()			
		};	

		for (var i = queryObj.keys.length - 1; i >= 0; i--) {
			var key = queryObj.keys[i];			
			queryString.concat('&', key, '=',queryObj[key]);
		}
		//Options: vanilla serilaize method, JQuery's $.param() method (requires dependancy)
		// for now this will suffice. If this method of queryString building is used heavily in our app 
		// then I think a more suitable refactor is in order.


		//Note: Solidifying our Models/Objects will get rid of a LOT of these 
		// sanity checks for value or length or type. We should structure our data
		// in a way that we can always assume the state of an object, and despite having or not
		// having a property set the activity is essentially the same.
		if(typeof self.odps.value != 'undefined'){
			queryString.concat('&odps=', self.odps.value.join(','));
		}

		if(typeof self.ndps.value != 'undefined'){
			queryString.concat('&ndps=', self.ndps.value.join(','));
		}

		if(typeof self.div.value != 'undefined'){
			queryString.concat('&div=', self.div.value);
		}
		
		return self.mapCgi.value + '?' + queryString;		
	};

	setContainerInnerHtml = function() {
		var domHelper = new DOMHelper();
  
		var cid = this.containerId;
  		var controls_id = cid + '_controls';
  		var zoomto_id = cid + '_zoomto';
  		var zoomout_id = cid + '_zoomout';
  		var zoomin_id = cid + '_zoomin';
		var img_id = cid + '_img';
		var busy_id = cid + '_busy';
		var size_id = cid + '_size';
		var odps_id = cid + '_odps';
		var ndps_id = cid + '_ndps';
		var div_id = cid + '_div';
		var ext_id = cid + '_extent';
		var clickxy_id = cid + '_clickxy';
		var lonlat_id = cid + '_click_lonlat';


		var wh = self.size.value;
		var domEls = new Array();
		var label;

		//Initial Map IMG- Always Create.
		domEls.push(domHelper.createEl('img', {id:img_id, src: this.imgUrl(), width:wh[0], height:wh[1], alt:'Loading Map...'})); //Why not in markup?
		domEls.push(domHelper.createEl('span',{id:busy_id, style:'display:none'}, '&nbsp; loading map....')); //Why not in markup?
		domEls.push(domHelper.createEl('br',{}));
		

		if(this.zoomto.ui == 'text'){
			label = self.zoomto.label || '';
			domEls.push(domHelper.createEl('label', {for:zoomto_id}, label));
			domEls.push(domHelper.createEl('input', {type:'text', id:zoomto_id, value: this.zoomin.src, title: this.zoomin.title}));					
		}

		if(this.zoomin.ui == 'image'){
			domEls.push(domHelper.createEl('input', {type:'image',id:zoomin_id, src:this.zoomin.src, title:this.zoomin.title}));
		}

		if(this.zoomout.ui == 'image'){
			domEls.push(domHelper.createEl('input',{type:'image',id:zoomout_id, src:this.zoomout.src, title:this.zoomout.title}));
		}
		

		if(this.size.ui == 'text'){
 	          label = self.size.label || '';
			domEls.push(domHelper.createEl('label',{for:size_id}, label));
			domEls.push(domHelper.createEl('input',{type:'text', id:size_id, value:this.size.value.join('x'), style:this.size.style}))
			domEls.push(domHelper.createEl('br',{}));

		}

		// Layers Each Iteration goes

		//...

		// .. Somewhere in Here..

		if(this.odps.ui == 'text'){

		}
		// TODO: create another helper method to create input/label together
		// needs to accept a closure or boolean, ID, and possibly label text.
		// 
		// build up a UI array/list to iterate through to create label/text utilizing domHelper.createEl()
		// this should reduce code length significantly

	}


//TODO: setMapImageWithBlob
//	setImgSrc
//   setImgSize
//   addEventListeners
//
		

};	



/// This should go into a common Utils module file.\
/// Overload generic Object class to include a method for loading arguments
/// from a map of K:V pairs. This works nested only 1 level deep, but can be modified to work
/// x levels deep utilizing basic recursion.
Object.prototype.LoadDynamicArgs = function(args){
	if(typeof args == 'object' && typeof this == 'object'){
		var keys = Object.keys(args);
		for (var i = keys.length - 1; i >= 0; i--) {
			var key = keys[i];
			obj[key] = args[key];
		}'
	}
	return obj;
}



String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};