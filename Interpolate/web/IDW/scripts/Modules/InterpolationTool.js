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
	    constructor: function (_map, _urlsObject) {
	        this.map = _map;
	        this.urls = _urlsObject;
	    },
        createIDWSurface: function (graphics, callback, cellsize, power) {
	        var self = this;
	        var gpUrl = this.urls.idwGPUrl;
	        var mapUrl = this.urls.idwMapUrl;

	        if (typeof this.resultLayer != 'undefined') {
	            this.map.removeLayer(this.resultLayer);
	        }

	        // Create params object to pass to geoprocessing service
	        // Names match parameter names on geoprocessing service
	        var featureSet = new FeatureSet();
	        featureSet.features = graphics;
            var params = {
	            Features: featureSet
	        };
	        if (typeof cellsize != 'undefined' && !isNaN(cellsize)) {
	            params.CellSize = cellsize;
	        }
	        if (typeof power != 'undefined' && !isNaN(power)) {
	            params.Power = power;
	        }

	        // Submit job
	        var gp = new Geoprocessor(gpUrl);
	        gp.submitJob(params, function (jobInfo) {
	            if (jobInfo.jobStatus == "esriJobFailed") {
	                console.log("JOB " + jobInfo.jobId + " failed");
	                alert("ERROR: Interpolation could not be completed.");
	            } else {
                    console.log("JOB " + jobInfo.jobId + " complete");

	                // add new map service to the map
	                self.resultLayer = new ArcGISDynamicMapServiceLayer(mapUrl + "/" + jobInfo.jobId, {
	                    "opacity": 1.0
	                });
	                self.map.addLayers([self.resultLayer]);

	                // get image
	                gp.getResultData(jobInfo.jobId, 'OutRaster',
                        function (result) {
                            if (typeof callback != 'undefined') {
                                callback(result.value.url, self.resultLayer);
                            }
	                    });
	            }
		    }, function (jobInfo) {
                //do nothing
		    }, function (jobInfo) {
		        console.log("ERROR");
		        console.log(jobInfo);
		    });

	    },
        createNNSurface: function (graphics, callback, cellsize) {
            var self = this;
	        var gpUrl = this.urls.nnGPUrl;
	        var mapUrl = this.urls.nnMapUrl;
	        
	        if (typeof this.resultLayer != 'undefined') {
	            this.map.removeLayer(this.resultLayer);
	        }

	        // Create params object to pass to geoprocessing service
	        // Names match parameter names on geoprocessing service
	        var featureSet = new FeatureSet();
	        featureSet.features = graphics;
	        var params = {
	            Features: featureSet
	        };
	        if (typeof cellsize != 'undefined' && !isNaN(cellsize)) {
	            params.CellSize = cellsize;
	        }

	        // Submit job
	        var gp = new Geoprocessor(gpUrl);
	        gp.submitJob(params, function (jobInfo) {
	            if (jobInfo.jobStatus == "esriJobFailed") {
	                console.log("JOB " + jobInfo.jobId + " failed");
	                alert("ERROR: Interpolation could not be completed.");
	            } else {
	                console.log("JOB " + jobInfo.jobId + " complete");

	                // add new map service to the map
	                self.resultLayer = new ArcGISDynamicMapServiceLayer(mapUrl + "/" + jobInfo.jobId, {
	                    "opacity": 1.0
	                });
	                self.map.addLayers([self.resultLayer]);

	                // get image
	                gp.getResultData(jobInfo.jobId, 'OutRaster',
                        function (result) {
                            if (typeof callback != 'undefined') {
                                callback(result.value.url, self.resultLayer);
                            }
                        });
	            }
	        }, function (jobInfo) {
	            //do nothing
	        }, function (jobInfo) {
	            console.log("ERROR");
	            console.log(jobInfo);
	        });

        },
        createSplineSurface: function (graphics, callback, cellsize) {
            var self = this;
            var gpUrl = this.urls.splineGPUrl;
            var mapUrl = this.urls.splineMapUrl;
            
            if (typeof this.resultLayer != 'undefined') {
                this.map.removeLayer(this.resultLayer);
            }

            // Create params object to pass to geoprocessing service
            // Names match parameter names on geoprocessing service
            var featureSet = new FeatureSet();
            featureSet.features = graphics;
            var params = {
                Features: featureSet
            };
            if (typeof cellsize != 'undefined' && !isNaN(cellsize)) {
                params.CellSize = cellsize;
            }

            // Submit job
            var gp = new Geoprocessor(gpUrl);
            gp.submitJob(params, function (jobInfo) {
                if (jobInfo.jobStatus == "esriJobFailed") {
                    console.log("JOB " + jobInfo.jobId + " failed");
                    alert("ERROR: Interpolation could not be completed.");
                } else {
                    console.log("JOB " + jobInfo.jobId + " complete");

                    // add new map service to the map
                    self.resultLayer = new ArcGISDynamicMapServiceLayer(mapUrl + "/" + jobInfo.jobId, {
                        "opacity": 1.0
                    });
                    self.map.addLayers([self.resultLayer]);

                    // get image
                    gp.getResultData(jobInfo.jobId, 'OutRaster',
                        function (result) {
                            if (typeof callback != 'undefined') {
                                callback(result.value.url, self.resultLayer);
                            }
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

