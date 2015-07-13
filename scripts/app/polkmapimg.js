function PolkMapImage(args){ 
	var utils = new ApplicationUtilities();	
	//var self = this.LoadDynamicArgs(args);
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

};

function ApplicationUtilities(){
	LoadDynamicArgs : function(args, obj){
		if(typeof args == 'object' && typeof obj == 'object'){
			var keys = Object.keys(args);
			for (var i = keys.length - 1; i >= 0; i--) {
				var key = keys[i];
				obj[key] = args[key];
			}
		}
		return obj;
	};			
}


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