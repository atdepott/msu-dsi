define([
      "dojo/_base/declare",
	  "esri/map",
      "esri/graphic",
      "esri/tasks/GeometryService", "esri/tasks/BufferParameters",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
      "dojo/dom-construct", 
      "dojo/_base/Color", "dojo/_base/array",
      "appConfig/defaults",
    ], function(
      declare, 
	  Map,
      Graphic,
      GeometryService, BufferParameters, 
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      domConstruct,
      Color, array,
      configOptions
    ) {
	
	var map;
	var geomService = new GeometryService(configOptions.geometryServiceURL);;
			
	return declare(null,{
		constructor: function(_map){
		    map = _map;
		},
		bufferFeature: function (geometry, distance, unit, callback) {
		    //TODO: clear only buffer graphics
		    map.graphics.clear();

		    if (unit == "MI") {
		        unit = GeometryService.UNIT_STATUTE_MILE;
		    } else {
		        unit = GeometryService.UNIT_KILOMETER;
		    }
		    doBuffer(geometry, distance, unit, callback);
        }
	});

	function doBuffer(geometry, distance, unit, callback) {
	    //show point symbol
	    var symbol = new SimpleMarkerSymbol(
          SimpleMarkerSymbol.STYLE_CIRCLE,
          3,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255, 0, 0, 0.65]), 1
          ),
          new Color([255, 0, 0, 0.65])
        );
	    var graphic = new Graphic(geometry, symbol);
	    map.graphics.add(graphic);

	    //setup the buffer parameters
	    var params = new BufferParameters();
	    params.distances = [distance];
	    params.bufferSpatialReference = map.spatialReference;
	    params.outSpatialReference = map.spatialReference;
	    params.unit = unit;

	    if (geometry.type === "polygon") {
	        //if geometry is a polygon then simplify polygon.  This will make the user drawn polygon topologically correct.
	        geomService.simplify([geometry], function (geometries) {
	            params.geometries = geometries;
	            geomService.buffer(params, function (bufferedGeometries) {
	                showBuffer(bufferedGeometries);
	                if (typeof callback != 'undefined') {
	                    callback(bufferedGeometries);
	                }
	            });
	        });
	    } else {
	        params.geometries = [geometry];
	        geomService.buffer(params, function (bufferedGeometries) {
	            showBuffer(bufferedGeometries);
	            if (typeof callback != 'undefined') {
	                callback(bufferedGeometries);
	            }
	        });
	    }
	}


	function showBuffer(bufferedGeometries) {
	    var symbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255, 0, 0, 0.65]), 2
          ),
          new Color([255, 0, 0, 0.35])
        );

	    array.forEach(bufferedGeometries, function (geometry) {
	        var graphic = new Graphic(geometry, symbol);
	        map.graphics.add(graphic);
	    });
	}
});

