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

    //var colors = {
    //    'hot1': { label: 'Hot (p <= 0.01)', color: new Color([178, 24, 43]) }, //lowest p-value hot spot
    //    'hot2': { label: 'Hot (p <= 0.05)', color: new Color([239, 138, 98]) },
    //    'hot3': { label: 'Hot (p <= 0.1)', color: new Color([253, 219, 199]) }, // highest p-value hot spot
    //    'default': { label: 'Default', color: new Color([247, 247, 247])}, // not statistically significant
    //    'cold1': { label: 'Cold (p <= 0.01)', color: new Color([209, 229, 240]) }, // lowest p-value cold spot
    //    'cold2': { label: 'Cold (p <= 0.05)', color: new Color([103, 169, 207]) },
    //    'cold3': { label: 'Cold (p <= 0.1)', color: new Color([33, 102, 172]) }  // highest p-value cold spot
    //}

    //var graphics_circles = {};

    //$.each(colors, function (classy, obj) {
    //    graphics_circles[classy] = new SimpleMarkerSymbol(
    //        SimpleMarkerSymbol.STYLE_CIRCLE,
    //        12,
    //        linesymbol,
    //        obj.color)
    //});

    var outsymbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE,
            12,
            linesymbol,
            new Color([103, 169, 207]));

    // number of X variables the GP service is expecting
    var expectedVariableCount = 5;

    return declare(null, {
        constructor: function (_map, _url) {
            this.map = _map;
            this.url = _url;
            this.EXPECTED_VARIABLE_COUNT = expectedVariableCount;
        },
        doOLS: function (graphics, dependantName, callback) {
            
            var self = this;
            var gpUrl = this.url;

            self.map.graphics.clear();

            var featureSet = new FeatureSet();
            featureSet.features = [];

            actualVariableCount = 0;

            attributeMap = {};

            // Create a copy of each graphic that has attributes as specified
            // in the schema on the GP service
            // also count the number of independant (X) variables we have
            $.each(graphics, function(idx, graphic){
                actualVariableCount = 0; // this actually only needs to be calced on one graphic, do it here for simplicity
                attribs = {};
                counter = 1;
                $.each(graphic.attributes, function(key, value){
                    if (key == dependantName){
                        attribs['Y'] = value;
                        attributeMap['Y'] = key;
                    } else {
                        attribs['X' + counter] = value;
                        attributeMap['X'+counter] = key;
                        counter++;
                        actualVariableCount++;
                    }
                });

                while (counter <= expectedVariableCount){
                    attribs['X'+counter] = '0';
                    counter++;
                }

                var g = new Graphic(graphic.geometry, null, attribs);
                featureSet.features.push(g);
            });

            // Create params object to pass to geoprocessing service
            // Names match parameter names on geoprocessing service
            var params = {
                in_features: featureSet,
                num_variables: actualVariableCount
            };

            // Submit job
            var gp = new Geoprocessor(gpUrl);
            gp.submitJob(params, function (jobInfo) {
                if (jobInfo.jobStatus == "esriJobFailed") {
                    console.log("JOB " + jobInfo.jobId + " failed");
                    console.log(jobInfo);

                    var toofewrecords = false;
                    $.each(jobInfo.messages, function (idx, msg) {
                        if (msg.description.indexOf("Too few records") > -1) {
                            toofewrecords = true;
                        }
                    });

                    if (toofewrecords) {
                        alert("ERROR: Too few records for analysis.");
                    } else {
                        alert("ERROR: Analysis could not be completed.");
                    }
                    callback();

                } else {
                    console.log("JOB " + jobInfo.jobId + " complete");
                    // get result
                    gp.getResultData(jobInfo.jobId, 'out_features', function (result) {
                        // build infotemplate:
                        var infoContent = "<table>";
                        // regression result fields:
                        infoContent += "<tr><td>Estimated:</td><td>${Estimated}</td></tr><tr><td>Residual:</td><td>${Residual}</td></tr><tr><td>StdResid:</td><td>${StdResid}</td></tr>";
                        // grab original attribute names:
                        //infoContent += "<tr><td>ORIGINAL DATA</td></tr>"
                        $.each(attributeMap, function (key, value) {
                            infoContent += "<tr><td>" + value + ":</td><td>${" + key + "}</td></tr>";
                        });
                        
                        infoContent += "</table>";
                        var infoTemplate = new InfoTemplate("RESULT", infoContent);

                        // iterate over results and draw on the map
                        $.each(result.value.features, function (index, value) {
                            value.setSymbol(outsymbol);
                            value.setInfoTemplate(infoTemplate);
                            self.map.graphics.add(value);
                        });

                        callback();
                    });

                    gp.getResultData(jobInfo.jobId, 'out_coefficients', function (result) {
                        var sTable = $("#simpleResults tbody");
                        sTable.empty();
                        var aTable = $("#advancedResults tbody");
                        aTable.empty();

                        $.each(result.value.features, function (idx, feature) {
                            // SIMPLE RESULTS
                            var srow = $("<tr/>").appendTo(sTable);
                            var variableName = feature.attributes["Variable"];
                            if (variableName == "Intercept") {
                                $("<td>").text("Intercept").appendTo(srow);
                            } else {
                                $("<td>").text(attributeMap[variableName]).appendTo(srow);
                            }
                            $("<td>").text(feature.attributes["Coef"]).appendTo(srow);

                            // ADVANCED RESULTS
                            var arow = $("<tr/>").appendTo(aTable);
                            var variableName = feature.attributes["Variable"];
                            if (variableName == "Intercept") {
                                $("<td>").text("Intercept").appendTo(arow);
                            } else {
                                $("<td>").text(attributeMap[variableName]).appendTo(arow);
                            }
                            $("<td>").text(feature.attributes["Coef"]).appendTo(arow);
                            $("<td>").text(feature.attributes["StdError"]).appendTo(arow);
                            $("<td>").text(feature.attributes["t_Stat"]).appendTo(arow);
                            $("<td>").text(feature.attributes["Prob"]).appendTo(arow);
                            $("<td>").text(feature.attributes["Robust_SE"]).appendTo(arow);
                            $("<td>").text(feature.attributes["Robust_t"]).appendTo(arow);
                            $("<td>").text(feature.attributes["Robust_Pr"]).appendTo(arow);
                        });

                        $("#simpleResults").dialog("open");
                    });

                    gp.getResultData(jobInfo.jobId, 'out_diagnostics', function (result) {
                        var sTable = $("#resultStats tbody");
                        sTable.empty();
                        
                        $.each(result.value.features, function (idx, feature) {
                            // SIMPLE RESULTS
                            var srow = $("<tr/>").appendTo(sTable);
                            $("<td class='diagname'>").text(feature.attributes["Diag_Name"]).appendTo(srow);
                            $("<td>").text(feature.attributes["Diag_Value"]).appendTo(srow);
                            $("<td>").text(feature.attributes["Definition"]).appendTo(srow);
                        });

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

    /*
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
    */
});

