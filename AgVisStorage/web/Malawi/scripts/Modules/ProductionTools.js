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
		},

		calculateCurrentStorage: function (_bigCount, _bigAmt, _smallCount, _smallAmt, _utilPercent, _productionValue) {
		    console.log(_bigCount + " " + _bigAmt + " " + _smallCount + " " + _smallAmt);
		    var currentStorage = ((_bigCount * _bigAmt) + (_smallCount * _smallAmt)); 
		    var currentUtil = (_utilPercent / 100) * _productionValue;
		    return { currentCapacity: currentStorage.toFixed(2), currentUtilization: currentUtil.toFixed(2) };
		},

		calculateMarketOpportunity: function (_futureProdValue, _currentUtilPercent, _utilPercentIncrease, _currentStorageCapacity) {
		    console.log(_futureProdValue + " " + _currentUtilPercent + " " + _utilPercentIncrease + " " + _currentStorageCapacity);
		    var futureStorage = _futureProdValue * ((_currentUtilPercent + _utilPercentIncrease) / 100);
		    var marketOpportunity = futureStorage - _currentStorageCapacity;
		    return { futureCapacity: futureStorage.toFixed(2), marketOpportunity: marketOpportunity.toFixed(2) };
		}
	});
});

