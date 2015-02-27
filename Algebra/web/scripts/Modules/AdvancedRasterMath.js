define([
      "dojo/_base/declare",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/graphic",
      "esri/tasks/Geoprocessor",
      "esri/tasks/FeatureSet",
      "dojo/on",
      "dojo/promise/all"
    ], function(
      declare,
      ArcGISDynamicMapServiceLayer,
      Graphic,
      Geoprocessor,
      FeatureSet,
      on, all
    ) {
			
	return declare(null,{
	    constructor: function (_map, _gpServiceUrl, _mapServiceUrl) {
	        this.map = _map;
	        this.gp = new Geoprocessor(_gpServiceUrl);
	        this.mapServiceUrl = _mapServiceUrl;
		},
	    add: function (geometries, expressionObj, callback) {
	        var self = this;

	        if (typeof this.resultLayer != 'undefined') {
	            this.map.removeLayer(this.resultLayer);
	        }

            // Create features from geometries
	        var features = [];
	        var idx = 1;
	        $.each(geometries, function (idx, geom) {
	            var graphic = new Graphic(geom, null, { OBJECTID: idx });
	            features.push(graphic);
	            idx = idx + 1;
	        });
	        var featureSet = new FeatureSet();
	        featureSet.features = features;

	        // Param names match parameter names on geoprocessing service
	        var expression = JSON.stringify(expressionObj);
	        console.log("EXPRESSION: " + expression);
	        var params = {
	            Area_of_Interest: featureSet,
	            Expression: expression
	        };

            // Submit job
	        this.gp.submitJob(params, function (jobInfo) {
	            if (jobInfo.jobStatus == "esriJobFailed") {
	                console.log("JOB " + jobInfo.jobId + " failed");
	                alert("ERROR: Job could not be completed.  Please check that the raster you have chosen is available in this area.");
	            } else {
                    console.log("JOB " + jobInfo.jobId + " complete");

	                // add new map service to the map
	                self.resultLayer = new ArcGISDynamicMapServiceLayer(self.mapServiceUrl + "/" + jobInfo.jobId, {
	                    "opacity": 1.0
	                });
	                self.map.addLayers([self.resultLayer]);

	                // get statistics & image
	                var minP = self.gp.getResultData(jobInfo.jobId, 'OutMinimum');
	                var maxP = self.gp.getResultData(jobInfo.jobId, 'OutMaximum');
	                var meanP = self.gp.getResultData(jobInfo.jobId, 'OutMean');
	                var stdP = self.gp.getResultData(jobInfo.jobId, 'OutStd');
	                var imgP = self.gp.getResultData(jobInfo.jobId, 'OutRaster');

	                var promises = new all([minP, maxP, meanP, stdP, imgP]);
	                promises.then(function (results) {
	                    var retVal = {};
	                    retVal.layer = self.resultLayer;
	                    $.each(results, function (idx, result) {
                            if (result.paramName == "OutMinimum") {
	                            retVal.minimum = result.value.toFixed(2);
	                        } else if (result.paramName == "OutMaximum") {
	                            retVal.maximum = result.value.toFixed(2);
	                        } else if (result.paramName == "OutMean") {
	                            retVal.mean = result.value.toFixed(2);
	                        } else if (result.paramName == "OutStd") {
	                            retVal.std = result.value.toFixed(2);
	                        } else if (result.paramName == "OutRaster") {
	                            retVal.imgUrl = result.value.url;
	                        }
	                    });
	                    callback(retVal);
	                });
	            }
		    }, function (jobInfo) {
                //do nothing
		    }, function (jobInfo) {
		        console.log("ERROR");
		        console.log(jobInfo);
		    });

	    },
	    updateTransparency: function (opacityVal) {
	        if (typeof this.resultLayer != 'undefined') {
	            this.resultLayer.setOpacity(opacityVal);
	        }
	    },
	    clear: function () {
	        if (typeof this.resultLayer != 'undefined') {
	            this.map.removeLayer(this.resultLayer);
	        }
	    }
	});
});

