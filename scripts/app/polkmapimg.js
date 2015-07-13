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
		  self.layers = [{ name: "Aerial_2014", isOn: false, ui: 'checkbox', label: 'Aerial'  },
		                 { name: "parcel"     , isOn: true , ui: 'checkbox', label: 'Parcels' },
		                 { name: "street"     , isOn: true , ui: 'checkbox', label: 'Streets' }
		  ];

			// The below properties all look to have the same composition. 
  			// Utilizing a reusable class could clean any other code up that utilizes this pattern.
  			// Same applies to any repeted parameters above (layers, zoomin/out, zoomto)

		  self.ndps   = { value: ['29100452571000','29100452572000','29100452573000'],
		                  ui: 'text', label: 'New DPs', style: 'display: inline' };
		  self.odps   = { value: ['29100452522003'], ui: 'text', label: 'Old DPs',
		                  style: 'display: inline' };
		  self.div    = { value: "201500500", ui: 'text', label: 'Division Sheet#',
		                  style: 'display: inline; width: 6em' };
		  self.dp     = { value: "29100452522003", ui: 'none', label: 'DP',
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
		return "0+0+" + zoomtoVal +"+" +zh; //This is faster than .join()
		//consider utilizing builtin String.concat, a custom helper, or  the above 
		//(especially when these .join calls are nested)
		return [0,0,zoomToVal,zh].join('+');
	};

	imgUrl : function () { 
		// Another personal preference. Declare any local variables at the top of the scope.
		// this example is the start of the function.
		var layernames = [];
		var extras = [];
		var qstr;

		for (var i = self.layers.length - 1; i >= 0; i--) {
			self.layers[i]
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
			if(keys[i].length > 0){
				extras.push(keys[i]) ? regEx.test(keys[i]) : continue;				
			}
		}

		//build queryString
		return self.buildQueryString();
	};

	buildQueryString : function(layernames,){ //this will be the object instance that called this method.
		var qStr;
		var layers = layernames.join("+");
		var size = this.size.value.join('x'); //Potential erorrs: should assume this.size will be an object.

	};

	queryStringHelper: function(k,seperator){
		var retStr;

		if(typeof(k.value) != "undefined"){
			retStr = k.value.join(seperator);	
		}
		return retStr;
	};

		// var queryString = {
		// 	layers: layernames.join('+'),
		// 	mapfile: self.mapfile
		// }

		//   qstr = ['layers=', layernames.join('+'), '&mapfile=', self.mapfile,
		//     '&size=', self.size.value.join('x'), '&rect=', self.zoomtoRect() ].join('');

		//   if (self.odps && self.odps.value) {
		//     qstr += ['&odps=', self.odps.value.join(',')].join('');
		//   }
		//   if (self.ndps && self.ndps.value) {
		//     qstr += ['&ndps=', self.ndps.value.join(',')].join('');
		//   }
		//   if (self.div && self.div.value) {
		//     qstr += ['&div=', self.div.value].join('');
		//   }

		//   extras.forEach(function(key) {
		//     qstr += ['&', key, '=', self[key]].join('');
		//   });

		//   return [self.mapCgi.value, '?', qstr].join('');
		// 	});

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
		}
	}
	return obj;
}

