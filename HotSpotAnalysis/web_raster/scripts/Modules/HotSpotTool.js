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

        doHotSpotAnalysis: function (itemid, callback) {
            var self = this;

            // Create params object to pass to geoprocessing service
            // Names match parameter names on geoprocessing service
            var params = {
                InputRaster: "{'itemID':" + itemid + "}"
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
                        self.map.setExtent(extent);
                    });

                    // setup click
                    self.clickhandler = self.map.on("click", function (event) {
                        findRasterValue(event, self.resultLayer.url, self.map);
                    });

                    drawLegend();

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
            if (typeof this.clickhandler != undefined) {
                this.clickhandler.remove();
            }
        },
        updateTransparency: function (opacityVal) {
            if (typeof this.resultLayer != 'undefined') {
                this.resultLayer.setOpacity(opacityVal);
            }
        },

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

    function drawLegend() {
        // these *should* correspond to the colors in that the service returns
        var colors = {
            'hot1': { label: 'Hot (p <= 0.01)', color: new Color([178, 24, 43]) }, //lowest p-value hot spot
            'hot2': { label: 'Hot (p <= 0.05)', color: new Color([239, 138, 98]) },
            'hot3': { label: 'Hot (p <= 0.1)', color: new Color([253, 219, 199]) }, // highest p-value hot spot
            'default': { label: 'Default', color: new Color([247, 247, 247]) }, // not statistically significant
            'cold1': { label: 'Cold (p <= 0.01)', color: new Color([209, 229, 240]) }, // lowest p-value cold spot
            'cold2': { label: 'Cold (p <= 0.05)', color: new Color([103, 169, 207]) },
            'cold3': { label: 'Cold (p <= 0.1)', color: new Color([33, 102, 172]) }  // highest p-value cold spot
        }

        // draw legend
        var legendTable = $("#legendDiv table");
        legendTable.empty();
        $.each(colors, function (classy, obj) {
            var row = $("<tr/>").appendTo(legendTable);

            // draw circle
            var colorCell = $("<td />").appendTo(row);

            var canvas = $("<canvas/>").attr("width", 20).attr("height", 20).appendTo(colorCell);
            var ctx = canvas[0].getContext("2d");
            ctx.fillStyle = obj.color.toHex();
            ctx.beginPath();
            ctx.arc(10, 10, 10, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();

            // create label
            var labelCell = $("<td />").text(obj.label).appendTo(row);
        });
    }
});

