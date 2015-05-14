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

    var outsymbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE,
            12,
            linesymbol,
            new Color([103, 169, 207]));

    var predictsymbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE,
        12,
        linesymbol,
        new Color([255, 255, 102]));

    // number of X variables the GP service is expecting
    var expectedVariableCount = 10;

    return declare(null, {
        constructor: function (_map, _url) {
            this.map = _map;
            this.url = _url;
            this.EXPECTED_VARIABLE_COUNT = expectedVariableCount;
        },
        doOLS: function (graphics, dependantName, callback) {
            
            var self = this;
            var gpUrl = this.url;
            this.coefficients = undefined;

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
                        infoContent += "<tr><td>Estimated:</td><td>${Estimated:NumberFormat(places:5)}</td></tr><tr><td>Residual:</td><td>${Residual:NumberFormat(places:5)}</td></tr><tr><td>StdResid:</td><td>${StdResid:NumberFormat(places:5)}</td></tr>";
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

                        // save these for the prediction
                        self.coefficients = { dependantName: dependantName, X: {}, INTERCEPT: undefined };

                        $.each(result.value.features, function (idx, feature) {
                            // SIMPLE RESULTS    
                            var srow = $("<tr/>").appendTo(sTable);
                            var variableName = feature.attributes["Variable"];
                            if (variableName == "Intercept") {
                                $("<td>").text("Intercept").appendTo(srow);
                                self.coefficients.INTERCEPT = feature.attributes["Coef"];
                                console.log(self.coefficients);
                            } else {
                                $("<td>").text(attributeMap[variableName]).appendTo(srow);
                                self.coefficients.X[attributeMap[variableName]] = feature.attributes["Coef"];
                                console.log(self.coefficients);
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
                            // STATISTICS
                            var srow = $("<tr/>").appendTo(sTable);
                            $("<td>").text(feature.attributes["Diag_Name"]).appendTo(srow);
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
            this.coefficients = undefined;
        },
        doPrediction: function (graphics) {
            var newgraphics = [];
            var coefficients = this.coefficients;
            console.log(coefficients);
            var error = "";
            $.each(graphics, function (idx, graphic) {
                graphic.setSymbol(predictsymbol);
                y = coefficients.INTERCEPT;
                $.each(coefficients.X, function (key, value) {
                    if (typeof graphic.attributes[key] == 'undefined' || isNaN(graphic.attributes[key])) {
                        error = 'Data variable ' + key + ' is missing or nonnumerical on a data point. Please try again with a different dataset.';
                        return false;
                    } else {
                        y += value * graphic.attributes[key];
                    }
                });
                if (error != "") {
                    return false;
                } else {
                    graphic.attributes[coefficients.dependantName] = y;
                    newgraphics.push(graphic);
                }
            });
            if (error != "") {
                console.log(error);
                return { "ERROR": error };
            } else {
                return { "points": newgraphics };
            }
        }

    });

});

