define([
      "dojo/_base/declare",
      "esri/request",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/graphic",
      "esri/tasks/Geoprocessor",
      "esri/tasks/FeatureSet",
      "esri/tasks/IdentifyTask",
      "esri/tasks/IdentifyParameters",
      "dojo/on",
      "dojo/promise/all",
      "dojo/dom",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color"

], function (
      declare,
      esriRequest,
      ArcGISDynamicMapServiceLayer,
      Graphic,
      Geoprocessor,
      FeatureSet,
      IdentifyTask,
      IdentifyParameters,
      on, all,
      dom,
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color
    ) {

    return declare(null, {
        constructor: function (_map, _gpurl, _uploadurl, _mapurl) {
            this.map = _map;
            this.gpurl = _gpurl;
            this.uploadurl = _uploadurl;
            this.mapurl = _mapurl;
        },

        uploadFile: function (fileUploadId, callback) {
            // upload file to arcgis server
            var itemid = "";
            var uploadurl = this.uploadurl;
            uploadRequest = esriRequest({
                    url: uploadurl,
                    form: dojo.byId(fileUploadId),
                    content: { "f": "pjson" },
                    load: function (response, io) {
                        var itemId = response["item"].itemID
                        callback(itemId);
                    },
                    error: function (error) {
                        console.log("error");
                        callback();
                    }
            }, { usePost: true });
        },

        doCluster: function (itemid, numClusters, callback) {
            var self = this;

            // Create params object to pass to geoprocessing service
            // Names match parameter names on geoprocessing service
            var params = {
                InputRaster: "{'itemID':" + itemid + "}",
                NumClusters: numClusters
            };
            
            // Submit job
            var gp = new Geoprocessor(self.gpurl);
            gp.submitJob(params, function (jobInfo) {
                if (jobInfo.jobStatus == "esriJobFailed") {
                    console.log("JOB " + jobInfo.jobId + " failed");
                    alert("ERROR: Clustering could not be completed.");
                } else {
                    console.log("JOB " + jobInfo.jobId + " complete");

                    // add new map service to the map
                    self.resultLayer = new ArcGISDynamicMapServiceLayer(self.mapurl + "/" + jobInfo.jobId, {
                        "opacity": 1.0
                    });
                    self.map.addLayers([self.resultLayer]);
                    var handler = self.map.on("layer-add", function (result) {
                        var extent = result.layer.fullExtent;
                        console.log(extent);
                        self.map.setExtent(extent);
                    });

                    // setup click
                    self.clickhandler = self.map.on("click", function (event) {
                        findRasterValue(event, self.resultLayer.url, self.map);
                    });

                    // get image
                    gp.getResultData(jobInfo.jobId, 'OutputRaster',
                        function (result) {
                            if (typeof callback != 'undefined') {
                                callback(result.value.url);
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
        clear: function () {
            if (typeof this.resultLayer != 'undefined') {
                this.map.removeLayer(this.resultLayer);
            }
        },
        updateTransparency: function (opacityVal) {
            if (typeof this.resultLayer != 'undefined') {
                this.resultLayer.setOpacity(opacityVal);
            }
        }
    });

    function findRasterValue(event, url, map) {
        var identifyTask = new IdentifyTask(url);

        var identifyParams = new IdentifyParameters();
        identifyParams.layerIds = [0];
        identifyParams.tolerance = 3;
        identifyParams.geometry = event.mapPoint;
        identifyParams.mapExtent = map.extent;

        identifyTask.execute(identifyParams, function (result) {
            if (result.length > 0) {
                var content = result[0].feature.attributes["Pixel Value"];
                console.log(content);
                map.infoWindow.setContent(content);
                map.infoWindow.show(event.mapPoint);
            } else {
                map.infoWindow.hide();
            }
        });
    }
});

