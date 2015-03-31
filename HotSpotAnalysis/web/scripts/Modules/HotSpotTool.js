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

    var colors = {
        'hot1': { label: 'Hot (p <= 0.01)', color: new Color([178, 24, 43]) }, //lowest p-value hot spot
        'hot2': { label: 'Hot (p <= 0.05)', color: new Color([239, 138, 98]) },
        'hot3': { label: 'Hot (p <= 0.1)', color: new Color([253, 219, 199]) }, // highest p-value hot spot
        'default': { label: 'Default', color: new Color([247, 247, 247])}, // not statistically significant
        'cold1': { label: 'Cold (p <= 0.01)', color: new Color([209, 229, 240]) }, // lowest p-value cold spot
        'cold2': { label: 'Cold (p <= 0.05)', color: new Color([103, 169, 207]) },
        'cold3': { label: 'Cold (p <= 0.1)', color: new Color([33, 102, 172]) }  // highest p-value cold spot
    }

    var graphics_circles = {};

    $.each(colors, function (classy, obj) {
        graphics_circles[classy] = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE,
            12,
            linesymbol,
            obj.color)
    });

    var infoTemplate = new InfoTemplate("VALUE", "${VALUE}");

    return declare(null, {
        constructor: function (_map, _url) {
            this.map = _map;
            this.url = _url;
        },
        findHotspots: function (graphics, callback) {
            var self = this;
            var gpUrl = this.url;

            self.map.graphics.clear();

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
                    gp.getResultData(jobInfo.jobId, 'out_features', function (result) {

                        $.each(result.value.features, function (index, value) {
                            var symbol = getSymbol(value.attributes['GiPValue'], value.attributes['GiZScore'])
                            value.setSymbol(symbol);
                            value.setInfoTemplate(infoTemplate);
                            self.map.graphics.add(value);
                        });

                        // draw legend
                        var legendTable = $("#legendDiv table");
                        $.each(colors, function (classy, obj) {
                            console.log(classy)
                            console.log(obj)

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

    function getSymbol(pvalue, zscore) {
        if (pvalue <= 0.01 && zscore > 0) {
            return graphics_circles['hot1'];
        } else if (pvalue <= 0.01 && zscore <= 0) {
            return graphics_circles['cold1'];
        } else if (pvalue <= 0.05 && zscore > 0) {
            return graphics_circles['hot2'];
        } else if (pvalue <= 0.05 && zscore <= 0) {
            return graphics_circles['cold2'];
        } else if (pvalue <= 0.1 && zscore > 0) {
            return graphics_circles['hot3'];
        } else if (pvalue <= 0.1 && zscore <= 0) {
            return graphics_circles['cold3'];
        } else {
            return graphics_circles['default'];
        }
    }
});

