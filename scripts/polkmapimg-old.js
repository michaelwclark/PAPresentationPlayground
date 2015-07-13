function PolkMapImg(args){  // var pmi1 = new PolkMapImg({mapfile: "div.map"}); var self = this;  // this gets reassigned in the forEach function below
  var self = this;
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

  //Can we make this into an object?
  // the below properties all look to have the same composition. 
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

  if (typeof args == 'object') { // override/add properties with args
    Object.keys(args).forEach(function(key) { self[key] = args[key]; });
  }
}

PolkMapImg.prototype.zoomtoRect = function () { var self = this;
  var wh = self.size.value;
  var zh = Math.round(self.zoomto.value * wh[1] / wh[0]);
  return [0,0,self.zoomto.value,zh].join('+');
};

PolkMapImg.prototype.imgUrl = function () { var self = this;
  var layernames = [];
  self.layers.forEach(function (layr) {
    if (layr.isOn) { layernames.push(layr.name); }
  });

  var extras = [];
  Object.keys(self).forEach(function(key) {
    if (key.search(/size|mapCgi|mapfile|layers|zoomto|odps|ndps|div|img_metadata/) == -1  && self[key].length > 0) { extras.push(key); }
  });

  var qstr = ['layers=', layernames.join('+'), '&mapfile=', self.mapfile,
    '&size=', self.size.value.join('x'), '&rect=', self.zoomtoRect() ].join('');
  if (self.odps && self.odps.value) {
    qstr += ['&odps=', self.odps.value.join(',')].join('');
  }
  if (self.ndps && self.ndps.value) {
    qstr += ['&ndps=', self.ndps.value.join(',')].join('');
  }
  if (self.div && self.div.value) {
    qstr += ['&div=', self.div.value].join('');
  }

  extras.forEach(function(key) {
    qstr += ['&', key, '=', self[key]].join('');
  });

  return [self.mapCgi.value, '?', qstr].join('');
};

PolkMapImg.prototype.setContainerInnerHtml = function () { var self = this;
  var pmi = new PolkMapImg();
  var cid = self.containerId;
  var wh = pmi.size.value;
  var imgId = cid + '_img';
  var html = ['<img id="', imgId,    '" src="', self.imgUrl(),
              '" width="', wh[0], '" height="', wh[1],
              '" alt="Loading map..."/>', "\n"
  ].join('');

  var controls_id = cid + '_controls';
  html += [ '<div id="', controls_id,
    '" style="display: inline-block; vertical-align: top;"'  ].join('');

  if (self.zoomto.ui == 'text') {
    var zoomto_id = cid + "_zoomto";
    label = self.zoomto.label || '';
    html += ['<label for="', zoomto_id, '">', label, "</label>",
             ' <input type="text" id="', zoomto_id,
                            '" value="', self.zoomto.value,
                            '" style="', self.zoomto.style, '"/>', "\n"
    ].join('');
  }

  if (self.zoomin.ui == 'image') {
    var zoomin_id = cid + "_zoomin";
    html += ['<input type="image" id="', zoomin_id,
                            '" src="', self.zoomin.src,
                           '" title="', self.zoomin.title, '"/>', "\n"
    ].join('');
  }

  if (self.zoomout.ui == 'image') {
    var zoomout_id = cid + "_zoomout";
    html += ['<input type="image" id="', zoomout_id,
                            '" src="', self.zoomout.src,
                           '" title="', self.zoomout.title, '"/>', "\n"
    ].join('');
  }

  var busy_id = cid + "_busy";
  html += ['<span id="', busy_id, '" style="display: none"> &nbsp; loading map...</span>'
  ].join('');

  html += "<br />\n";

  if (self.size.ui == 'text') {
    var size_id = cid + "_size";
    label = self.size.label || '';
    html += ['<label for="', size_id, '">', label, "</label>",
             ' <input type="text" id="', size_id,
                            '" value="', self.size.value.join('x'),
                            '" style="', self.size.style, '"/>', "<br />\n"
    ].join('');
  }

  self.layers.forEach(function (layr) {
    if (layr.ui == 'checkbox') {
        var layr_id = cid + "_layer_" + layr.name;
        label = layr.label || layr.name;
        var checked = layr.isOn ? ' checked' : '' ;
        html += ['<input id="', layr_id,
                    '" type="checkbox" name="', layr.name,
                   '" value="', layr.name, '"', checked, ' />',
                 ' <label for="', layr_id, '">', label, "</label><br />\n"
        ].join('');
    }
  });

  if (self.odps.ui == 'text') {
    var odps_id = cid + "_odps";
    label = self.odps.label || '';
    html += ['<label for="', odps_id, '">', label, "</label>",
             ' <input type="text" id="', odps_id,
                            '" value="', self.odps.value.join(','),
                            '" style="', self.odps.style, '"/>', "<br />\n"
    ].join('');
  }

  if (self.ndps.ui == 'text') {
    var ndps_id = cid + "_ndps";
    label = self.ndps.label || '';
    html += ['<label for="', ndps_id, '">', label, "</label>",
             ' <input type="text" id="', ndps_id,
                            '" value="', self.ndps.value.join(','),
                            '" style="', self.ndps.style, '"/>', "<br />\n"
    ].join('');
  }

  if (self.div.ui == 'text') {
    var div_id = cid + "_div";
    label = self.div.label || '';
    html += ['<label for="', div_id, '">', label, "</label>",
             ' <input type="text" id="', div_id,
                            '" value="', self.div.value,
                            '" style="', self.div.style, '"/>', "<br />\n"
    ].join('');
  }

  if (self.extent.ui == 'text') {
    var ext_id = cid + '_extent';
    label = self.extent.label || '';
    html += ['<label for="', ext_id, '">', label, "</label>",
             ' <input type="text" id="', ext_id,
                            '" value="', self.extent.value.join(' '),
                            '" style="', self.extent.style, '"/>', "<br />\n"
    ].join('');
  }

  if (self.clickxy.ui == 'text') {
    var xy_id = cid + '_clickxy';
    label = self.clickxy.label || '';
    html += ['<label for="', xy_id, '">', label, "</label>",
             ' <input type="text" id="', xy_id,
                            '" value="', self.clickxy.value.join(' '),
                            '" style="', self.clickxy.style, '"/>', "<br />\n"
    ].join('');
  }

  if (self.click_lonlat.ui == 'text') {
    var lonlat_id = cid + '_click_lonlat';
    label = self.click_lonlat.label || '';
    html += ['<label for="', lonlat_id, '">', label, "</label>",
             ' <input type="text" id="', lonlat_id,
                            '" value="', self.click_lonlat.value.join(' '),
                            '" style="', self.click_lonlat.style, '"/>', "<br />\n"
    ].join('');
  }

  html += ['</div>', "\n"].join('');
  document.getElementById(self.containerId).innerHTML = html;
};

PolkMapImg.prototype.xhrGetBlobAndApplyFunc = function (arg) {
  // arg = { url: 'http://www.example.com/pic.png',
  //         type: 'image/png',
  //         func: myFuncExpectsSelfAndBlob }
  var self = this;
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {  // wait until all data has arrived
    arg.func( self, new Blob([xhr.response], {type: arg.type}) );
  };

//var oneHrAgo = new Date( new Date - 3600000 );
  xhr.open('GET', arg.url);
//xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
  xhr.send();
};

PolkMapImg.prototype.setMapImageWithBlob = function (self, blob) {
  var cid  = self.containerId;
  var imgId= cid + '_img';
  var blobUrl = (window.URL || window.webkitURL).createObjectURL(blob);
  document.getElementById(imgId).src = blobUrl;
  // Now let's set self.img_metadata
  var tail = blob.slice(-5000);  // s/b enough off end to get all metadata
  var reader = new FileReader();
  reader.onload = function () {
    var arr = /<xmp:Query_string>(.*?)<\/xmp:Query_string>/.exec(
        reader.result );
    if (arr) {
      var kvs = arr[1].split('&amp;');
      var obj = {};
      kvs.forEach(function (kv) {
        var tuple = kv.split('=');
        obj[tuple[0]] = tuple[1];
      });
      self.img_metadata = obj;
      var ext = obj.mapext || '';
      if (ext) {
        var x1y1x2y2 = ext.split('+');
        var coords = [];
        x1y1x2y2.forEach( function (num) { coords.push(Math.round(num)); });
        self.extent.value = coords;
      }
      if (self.extent.ui == 'text') {
        document.getElementById(cid + '_extent').value = self.extent.value.join(' ');
      }
    }
  };
  reader.readAsText(tail);
};

PolkMapImg.prototype.setImgSrc = function () { var self = this;
  var cid = self.containerId;
//var img  = document.getElementById(cid + '_img');
//img.src = self.imgUrl();
  self.xhrGetBlobAndApplyFunc({
    url: self.imgUrl(), type: 'image/png', func: self.setMapImageWithBlob
  });
  document.body.style.cursor = 'wait';  // until showLoaded below
  document.getElementById(cid + '_busy').style = 'display: inline';
};

PolkMapImg.prototype.setImgSize = function () { var self = this;
  var imgId = self.containerId + '_img';
  var img = document.getElementById(imgId);
  var wh = self.size.value;
  img.width = wh[0];
  img.height= wh[1];
};

PolkMapImg.prototype.addEventListeners = function () { var self = this;
  var imid = self.containerId + '_img';
  var showLoaded = function () {
    document.body.style.cursor = '';  // end wait cursor
    document.getElementById(self.containerId + '_busy').style = 'display: none';
  };
  document.getElementById(imid).addEventListener('load', showLoaded);
  document.getElementById(imid).addEventListener('error', showLoaded);
  var xyid = self.containerId + '_clickxy';
  var lonlat_id = self.containerId + '_click_lonlat';
  var showClick = function (e) {
    var x = e.clientX;
    var y = e.clientY;
    self.clickxy.value = [x, y];

    var x1y1x2y2 = self.extent.value;
    var wh = self.size.value;
    if (wh[0] > 0 && wh[1] > 0 && x1y1x2y2[2] != x1y1x2y2[0]) {
    // var lon = (1*x1y1x2y2[0]) + (1*x1y1x2y2[2] - 1*x1y1x2y2[0]) * ((1*x) / (1*wh[0]));
      var lon = x1y1x2y2[0] + (x1y1x2y2[2] - x1y1x2y2[0]) * (x / wh[0]);
      var lat = x1y1x2y2[1] + (x1y1x2y2[3] - x1y1x2y2[1]) * y / wh[1];
      self.click_lonlat.value = [Math.round(lon), Math.round(lat)];
    }

    var xyel = document.getElementById(xyid);
    if (xyel) { xyel.value = self.clickxy.value.join(' '); }
    var lonlat_el = document.getElementById(lonlat_id);
    if (lonlat_el) { lonlat_el.value = self.click_lonlat.value.join(' '); }
  };
  if (document.getElementById(xyid)) {
    document.getElementById(imid).addEventListener('click', showClick);
  }

  var ztid = self.containerId + '_zoomto';
  var changeZoom = function () {
    self.zoomto.value = document.getElementById(ztid).value;
    self.setImgSrc();
  };
  document.getElementById(ztid).addEventListener("change", changeZoom);

  var ziid = self.containerId + '_zoomin';
  document.getElementById(ziid).addEventListener("click", function () {
    document.getElementById(ztid).value /= 2;
    changeZoom();
  });

  var zoid = self.containerId + '_zoomout';
  document.getElementById(zoid).addEventListener("click", function () {
    document.getElementById(ztid).value *= 2;
    changeZoom();
  })

  var szid = self.containerId + '_size';
  document.getElementById(szid).addEventListener("change", function () {
    self.size.value = [ document.getElementById(szid).value.split('x') ];
    self.setImgSize();
    self.setImgSrc();
  });

  self.layers.forEach(function (layr) {
    if (layr.ui == 'checkbox') {
      var cbid = self.containerId + '_layer_' + layr.name;
      document.getElementById(cbid).addEventListener("change", function () {
          layr.isOn = document.getElementById(cbid).checked;
          self.setImgSrc();
      });
    }
  });
};
