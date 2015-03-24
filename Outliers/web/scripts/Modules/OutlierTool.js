define([
      "dojo/_base/declare",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/graphic",
      "esri/tasks/Geoprocessor",
      "esri/tasks/FeatureSet",
      "esri/InfoTemplate",
      "dojo/on",
      "dojo/promise/all",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color"

], function (
      declare,
      ArcGISDynamicMapServiceLayer,
      Graphic,
      Geoprocessor,
      FeatureSet,
      InfoTemplate,
      on, all,
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color
    ) {

    var linesymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 1]), 2);

    var outlierSymbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE,
        12,
        linesymbol,
        new Color([255, 0, 0, 1]));

    var defaultSymbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE,
        12,
        linesymbol,
        new Color([240, 255, 255, 1]));

    var infoTemplate = new InfoTemplate("VALUE", "${VALUE}");

    return declare(null, {
        constructor: function (_map, _url) {
            this.map = _map;
            this.url = _url;
        },
        findOutliers: function (graphics, callback, numClusters) {
            var self = this;
            var gpUrl = this.url;

            // Create params object to pass to geoprocessing service
            // Names match parameter names on geoprocessing service
            var featureSet = new FeatureSet();
            featureSet.features = graphics;
            var params = {
                in_features: featureSet
            };

            // Submit job
            var gp = new Geoprocessor(gpUrl);
            gp.submitJob(params, function (jobInfo) {
                if (jobInfo.jobStatus == "esriJobFailed") {
                    console.log("JOB " + jobInfo.jobId + " failed");
                    alert("ERROR: Analysis could not be completed.");
                } else {
                    console.log("JOB " + jobInfo.jobId + " complete");
                    // get result
                    gp.getResultData(jobInfo.jobId, 'out_features',
                        function (result) {
                            
                            $.each(result.value.features, function (index, value) {
                                var cluster = value.attributes["COType"];
                                if (cluster == "HL" || cluster == "LH") {
                                    value.setSymbol(outlierSymbol);
                                } else {
                                    value.setSymbol(defaultSymbol);
                                }
                                value.setInfoTemplate(infoTemplate);
                                self.map.graphics.add(value);
                            });

                            callback();
                        });
                }
            }, function (jobInfo) {
                //do nothing
            }, function (jobInfo) {
                console.log("ERROR");
                console.log(jobInfo);
            });

        },
        clear: function () {
            this.map.graphics.clear();
        }
    });
});

