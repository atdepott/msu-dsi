define([
      "dojo/_base/declare",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/graphic",
      "esri/tasks/Geoprocessor",
      "esri/tasks/FeatureSet",
      "dojo/on",
      "dojo/promise/all",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color"

    ], function(
      declare,
      ArcGISDynamicMapServiceLayer,
      Graphic,
      Geoprocessor,
      FeatureSet,
      on, all,
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color
    ) {
			
			
			
		var colors = {1: new Color([31,120,180, 1]),
                  2: new Color([51,160,44, 1]),
                  3: new Color([227,26,28, 1]),
                  4: new Color([255,127,0, 1]),
                  5: new Color([255, 255, 255, 1]),
                  6: new Color([202,178,214, 1]),
                  7: new Color([253,191,111, 1]),
                  8: new Color([251,154,153, 1]),
                  9: new Color([178,223,138, 1]),
                  10: new Color([166,206,227, 1])
                  };
    var graphics_circles = {};
    var linesymbol = new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color([0, 0, 0, 1]), 2
        );
        
    $.each(colors, function (classy, color){
        graphics_circles[classy] = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE,
            12,
            linesymbol,
            color)
        });
        
        

    
            
        
	return declare(null,{
	    constructor: function (_map, _url) {
	        this.map = _map;
	        this.url = _url;
	    },
        knnCluster: function (graphics, callback, numClusters) {
	        var self = this;
	        var gpUrl = this.url;
	        

	       
	        // Create params object to pass to geoprocessing service
	        // Names match parameter names on geoprocessing service
	        var featureSet = new FeatureSet();
	        featureSet.features = graphics;
          var params = {
	            in_point: featureSet,
	            num_clusters: numClusters
	        };


	        // Submit job
	        var color_set = {};
	        var gp = new Geoprocessor(gpUrl);
	        gp.submitJob(params, function (jobInfo) {
	            if (jobInfo.jobStatus == "esriJobFailed") {
	                console.log("JOB " + jobInfo.jobId + " failed");
	                alert("ERROR: Clustering could not be completed.");
	            } else {
                    console.log("JOB " + jobInfo.jobId + " complete");
	                // get image
	                gp.getResultData(jobInfo.jobId, 'output',
                        function (result) {
                            /*if (typeof callback != 'undefined') {
                                callback(result.value.url);
                            }*/
                            $.each(result.value.features, function (index,value) {
                                /*if (value.attributes.SS_GROUP == 1) {
                                    value.setSymbol(pointSymbol1); 
                                    self.map.graphics.add(value);                                  
                                }
                                if (value.attributes.SS_GROUP == 2) {
                                    value.setSymbol(pointSymbol2);  
                                    self.map.graphics.add(value);                                 
                                }
                                if (value.attributes.SS_GROUP == 3) {
                                    value.setSymbol(pointSymbol3);  
                                    self.map.graphics.add(value);        
                                }
                                if (value.attributes.SS_GROUP == 4) {
                                    value.setSymbol(pointSymbol4);  
                                    self.map.graphics.add(value);                                 
                                }
                                if (value.attributes.SS_GROUP == 5) {
                                    value.setSymbol(pointSymbol5);  
                                    self.map.graphics.add(value);        
                                }                                
                                
                                if (value.attributes.SS_GROUP == 6) {
                                    value.setSymbol(pointSymbol6);  
                                    self.map.graphics.add(value);                                 
                                }
                                if (value.attributes.SS_GROUP == 7) {
                                    value.setSymbol(pointSymbol7);  
                                    self.map.graphics.add(value);        
                                }
                                if (value.attributes.SS_GROUP == 8) {
                                    value.setSymbol(pointSymbol8);  
                                    self.map.graphics.add(value);                                 
                                }
                                if (value.attributes.SS_GROUP == 9) {
                                    value.setSymbol(pointSymbol9);  
                                    self.map.graphics.add(value);        
                                }                                
                                
                                if (value.attributes.SS_GROUP == 10) {
                                    value.setSymbol(pointSymbol10);  
                                    self.map.graphics.add(value);                                 
                                }*/
                                
                                value.setSymbol(graphics_circles[value.attributes.SS_GROUP]);
                                self.map.graphics.add(value); 
                                color_set[value.attributes.SS_GROUP]=true;
                                
                                                                
                            }) 
                            
                            
            var legendDiv = $("#legendDiv");
            var legendTable = $("<table/>").appendTo(legendDiv);
            $.each(colors, function (classy, color) {
                if(color_set[classy] == true) {
                    var row = $("<tr/>").appendTo(legendTable);
                    var colorCell = $("<td />").appendTo(row);
                    //colorCell.addClass("legendImageCell");
                    var canvas = $("<canvas/>").attr("width", 20).attr("height", 20).appendTo(colorCell);
                    var ctx = canvas[0].getContext("2d");
                    ctx.fillStyle = color.toHex();
                    ctx.beginPath();
                    ctx.arc(10, 10, 10, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle= 'black';
                    ctx.stroke();

                    
                    var labelCell = $("<td />").text("Cluster " + classy).appendTo(row);
                    //labelCell.addClass("legendLabelCell");
                }
            });
            
            callback();
	                    });
	            }
		    }, function (jobInfo) {
                //do nothing
		    }, function (jobInfo) {
		        console.log("ERROR");
		        console.log("ERROR");
		        console.log(jobInfo);
		    });
        
	    },
	    clear: function () {
	        if (typeof this.resultLayer != 'undefined') {
	            this.map.removeLayer(this.resultLayer);
	        }
	    }
	});
});

