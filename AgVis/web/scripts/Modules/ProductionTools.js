define([
      "dojo/_base/declare",
      "app/CropStats"
    ], function(
      declare, 
      CropStats
    ) {
	
	return declare(null,{
	    constructor: function (_map, _cropStatsUrl, _geomOps) {
	        this.geometryOps = _geomOps;
	        this.geoprocessor = new CropStats(_map, _cropStatsUrl);
	    },
        		
		calculateProduction: function (geometries, crop, callback) {
		    var geoprocessor = this.geoprocessor;
		    geoprocessor.getProductionStats(geometries, crop, function (result) {
		        callback(result);
		    });
		},

		calculateIncreasedProduction: function (_increasePercent, _productionValue) {
		    var m = (100 + _increasePercent) / 100;
		    var increaseProductionValue = m * _productionValue;
		    return increaseProductionValue.toFixed(2);
        }
	});
});

