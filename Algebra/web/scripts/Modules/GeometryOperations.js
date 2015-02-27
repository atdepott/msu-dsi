define([
      "dojo/_base/declare",
	  "esri/map","esri/graphic", "esri/SpatialReference",
      "esri/tasks/GeometryService", "esri/tasks/BufferParameters",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
      "dojo/_base/Color", "dojo/_base/array"
], function (
      declare,
	  Map, Graphic, SpatialReference,
      GeometryService, BufferParameters,
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      Color, array
    ) {

    var pointSymbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE,
        3,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255, 0, 0, 0.65]), 1
            ),
        new Color([255, 0, 0, 0.65])
    );

    var polySymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_NULL,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color([255, 0, 0, 0.65]), 2
      ),
      new Color([255, 0, 0, 0.35])
    );

    return declare(null, {
        constructor: function (_map, _url) {
            this.map = _map;
            this.geomService = new GeometryService(_url);
        },
        bufferFeature: function (_geometry, _distance, _unit, _callback) {
            //cannot access object-level variables inside callback functions:
            geomService = this.geomService;
            map = this.map;

            map.graphics.clear();

            var graphic = new Graphic(_geometry, pointSymbol);
            this.map.graphics.add(graphic);

            //setup the buffer parameters
            var params = new BufferParameters();
            params.distances = [_distance];
            params.bufferSpatialReference = new SpatialReference(4326);
            params.geodesic = true;
            params.outSpatialReference = map.spatialReference;
            if (_unit == "MI") {
                params.unit = GeometryService.UNIT_STATUTE_MILE;
            } else {
                params.unit = GeometryService.UNIT_KILOMETER;
            }

            if (_geometry.type === "polygon") {
                //if geometry is a polygon then simplify polygon.  This will make the user drawn polygon topologically correct.
                geomService.simplify([_geometry], function (geometries) {
                    params.geometries = geometries;
                    geomService.buffer(params, function (bufferedGeometries) {
                        showBuffer(map, bufferedGeometries);
                        if (typeof _callback != 'undefined') {
                            _callback(bufferedGeometries);
                        }
                    });
                });
            } else {
                params.geometries = [_geometry];
                geomService.buffer(params, function (bufferedGeometries) {
                    showBuffer(map, bufferedGeometries);
                    if (typeof _callback != 'undefined') {
                        _callback(bufferedGeometries);
                    }
                });
            }

        }
    });

    function showBuffer(map, bufferedGeometries) {
        array.forEach(bufferedGeometries, function (geometry) {
            var graphic = new Graphic(geometry, polySymbol);
            map.graphics.add(graphic);
        });
    }
});

