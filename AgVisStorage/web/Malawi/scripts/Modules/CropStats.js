define([
      "dojo/_base/declare",
	  "esri/map",
      "esri/graphic",
      "esri/tasks/Geoprocessor",
      "esri/tasks/FeatureSet",
      "dojo/promise/all"
    ], function(
      declare, 
	  Map,
      Graphic,
      Geoprocessor,
      FeatureSet,
      all
    ) {
			
	return declare(null,{
	    constructor: function (_map, _url) {
	        this.gp = new Geoprocessor(_url);
		},
		getProductionStats: function (geometries, crop, callback) {
		    var gp = this.gp;

		    var features = [];
		    var idx = 1;
		    $.each(geometries, function (idx, geom) {
		        var graphic = new Graphic(geom, null, { OBJECTID: idx });
		        features.push(graphic);
		        idx = idx + 1;
		    });

		    var featureSet = new FeatureSet();
		    featureSet.features = features;

		    var params = {
		        Geometry: featureSet,
		        Crop_Type: crop
		    };

		    gp.submitJob(params, function (jobInfo) {
		        //console.log("JOB COMPLETE");
		        var countD = gp.getResultData(jobInfo.jobId, 'OutputCount');
		        var valueD = gp.getResultData(jobInfo.jobId, 'OutputValue');

		        var promises = new all([countD, valueD]);
		        promises.then(function (results) {
		            var retVal = {};

		            $.each(results, function (idx, result) {
		                //console.log(result.paramName);
		                if (result.paramName == "OutputCount") {
		                    retVal.pixelCount = result.value;
		                } else if (result.paramName == "OutputValue") {
		                    retVal.productionValue = result.value.toFixed(2);
		                }
		            });

		            callback(retVal);
		        });

		    }, function (jobInfo) {
                //do nothing
		    }, function (jobInfo) {
		        callback({ pixelCount: "ERROR", productionValue: "ERROR" });
		    });
        }
	});
});

