require([
    "esri/map",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Popup",
    "esri/graphic",
    "esri/graphicsUtils",
    "esri/Color",
    "dojo/parser",
    "dojo/on",
    "appConfig/defaults",
    "app/OLSTool",
    "app/CSVTool", 
    "dijit/layout/BorderContainer", // TODO WHY DOES THIS NEED TO BE HERE???
    "dojo/domReady!"
], function (
    Map,
    Legend,
    Scalebar,
    BasemapToggle,
    Popup,
    Graphic,
    graphicsUtils,
    Color,
    parser,
    on,
    config, 
    OLSTool, CSVTool
) {
    // call this here to ensure that map fills entire content pane
    parser.parse();

    esriConfig.defaults.io.proxyUrl = "http://dsidb.cse.msu.edu/proxy.ashx"
    esriConfig.defaults.io.alwaysUseProxy = false;

    // set application title
    document.title = config.title;
    $("#title").empty();
    $("#title").append(config.title);

    var infoWindow = new Popup({}, "infowindow");
    infoWindow.resize(200, 200);

    var map = new Map("map", {
        basemap: "topo",
        center: [36.8167, -1.2833],
        zoom: 8,
        infoWindow: infoWindow
    });

    var toggle = new BasemapToggle({
        map: map,
        basemap: "satellite"
    }, "BasemapToggle");
    toggle.startup();

    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });
    
    var gpTool = new OLSTool(map, config.GPUrl);
    var csvTool = new CSVTool();

    var csvstring;
    var points;
    var dependantfield, latfield, lonfield, valFields;

    $("#uploadFile").change(function () {
        var file = this.files[0];
        if (file.data) {
            var decoded = bytesToString(dojox.encoding.base64.decode(file.data));
            handleCsv(decoded);
        } else {
            var reader = new FileReader();
            reader.onload = function () {
                handleCsv(reader.result)
            };
            reader.readAsText(file);
        }
    });

    function handleCsv(_csvstring) {
        csvstring = _csvstring;
        var headers = csvTool.getHeaders(csvstring);

        // TODO check if we have enough rows

        var opts_lat = [];
        var opts_lon = [];
        var opts_val = [];
        var latfield = "";
        var lonfield = "";
        
        // build options object and find default values
        $.each(headers, function (idx, headername) {
            //console.log(headername);
            if (headername.toUpperCase() == "LATITUDE" ||
                headername.toUpperCase() == "LAT" ||
                headername.toUpperCase() == "POINT_Y" ||
                headername.toUpperCase() == "Y") {
                latfield = headername;
            } else if (headername.toUpperCase() == "LONGITUDE" ||
                headername.toUpperCase() == "LON" ||
                headername.toUpperCase() == "LONG" ||
                headername.toUpperCase() == "POINT_X" ||
                headername.toUpperCase() == "X") {
                lonfield = headername;
            }

            opt = $("<option/>").text(headername).val(headername);
            opts_lat.push(opt);
            opt = $("<option/>").text(headername).val(headername);
            opts_lon.push(opt);
            opt = $("<option/>").text(headername).val(headername);
            opts_val.push(opt);
        });

        // append options to dropdowns
        $("#latNameInput").empty();
        $("#latNameInput").append(opts_lat);
        $("#lonNameInput").empty();
        $("#lonNameInput").append(opts_lon);
        $(".columnSelector").empty();
        $(".columnSelector").append(opts_val);

        // set default values, if we have them
        if (latfield != "") {
            $("#latNameInput").val(latfield);
        }
        if (lonfield != "") {
            $("#lonNameInput").val(lonfield);
        }

        // show dialog box
        $("#csvDialog").dialog("open");
    }

    $("#calcButton").button().click(function () {
        if (typeof points == 'undefined' || points.length <= 0) {
            alert("Please upload a file before completing your calculation.");
        } else {
            $('#busy').show();
            gpTool.doOLS(points, dependantfield, onAnalysisComplete);
        }
    });
    
    $("#clearButton").button().click(function () {
        map.graphics.clear();
        points = undefined;
        dependantfield = undefined;
        latfield = undefined;
        lonfield = undefined;
        valFields = undefined;

        // replace file uploaders
        var control = $("#uploadFile");
        control.replaceWith(control.val('').clone(true));
        control = $("#uploadFile2");
        control.replaceWith(control.val('').clone(true));

        $("#simpleResultsButton").hide();
        $("#simpleResults tbody").empty();
        $("#advancedResultsButton").hide();
        $("#advancedResults tbody").empty();
        $("#resultStatsButton").hide();
        $("#resultStats tbody").empty();
        $("#predictionDiv").hide();
        $("#downloadLink").hide();
    });

    $("#simpleResultsButton").button().click(function () {
        $("#simpleResults").dialog("open");
    });

    $("#advancedResultsButton").button().click(function () {
        $("#advancedResults").dialog("open");
    });

    $("#resultStatsButton").button().click(function () {
        $("#resultStats").dialog("open");
    });
    
    $("#csvDialog").dialog({
        autoOpen: false,
        width: 300,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "OK": function () {
                latfield = $("#latNameInput").val();
                lonfield = $("#lonNameInput").val();
                
                // get selected column header and index
                dependantfield = $("#dependantColumn").val();
                
                // get selected column indexes from column input and push values onto a list
                valfields = []
                $("#valueColumns option:selected").each(function () {
                    valfields.push($(this).val());
                });
                
                if (valfields.length > gpTool.EXPECTED_VARIABLE_COUNT) {
                    alert("Please choose a maximum of " + gpTool.EXPECTED_VARIABLE_COUNT + " data columns.");

                } else if (valfields.length == 0) {
                        alert("Please choose at least 1 data column.");

                } else {
                    map.graphics.clear();

                    resultObj = csvTool.csvToGraphicsAdv(csvstring, latfield, lonfield, valfields, dependantfield);

                    if (typeof resultObj.ERROR != 'undefined') {
                        alert("ERROR: " + resultObj.ERROR);

                    } else {
                        points = resultObj.points;
                        map.setExtent(graphicsUtils.graphicsExtent(points));
                        $.each(points, function (idx, graphic) {
                            map.graphics.add(graphic);
                        });

                        $(this).dialog("close");
                    }
                    
                }
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    $("#simpleResults").dialog({
        autoOpen: false,
        width: 300,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "OK": function () {
                $(this).dialog("close");
            }
        }
    });

    $("#advancedResults").dialog({
        autoOpen: false,
        width: 800,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "OK": function () {
                $(this).dialog("close");
            }
        }
    });

    $("#resultStats").dialog({
        autoOpen: false,
        width: 600,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "OK": function () {
                $(this).dialog("close");
            }
        }
    });

    function onAnalysisComplete() {
        $('#busy').hide();

        $("#simpleResultsButton").show();
        $("#advancedResultsButton").show();
        $("#resultStatsButton").show();
        $("#predictionDiv").show();
    }

    $("#uploadFile2").change(function () {
        var file = this.files[0];
        if (file.data) {
            var decoded = bytesToString(dojox.encoding.base64.decode(file.data));
            handlePredictionFile(decoded);
        } else {
            var reader = new FileReader();
            reader.onload = function () {
                handlePredictionFile(reader.result)
            };
            reader.readAsText(file);
        }
    });

    function handlePredictionFile(_csvstring) {
        resultObj = csvTool.csvToGraphicsAdv(_csvstring, latfield, lonfield, valfields, undefined, dependantfield);

        if (typeof resultObj.ERROR != 'undefined') {
            alert("ERROR: " + resultObj.ERROR);

        } else {
            var csvpoints = resultObj.points;
            resultObj2 = gpTool.doPrediction(csvpoints)
            if (typeof resultObj2.ERROR != 'undefined') {
                alert("ERROR: " + resultObj2.ERROR);
            }
            else {
                predictionpoints = resultObj2.points;

                // add to map
                map.setExtent(graphicsUtils.graphicsExtent(predictionpoints));
                $.each(predictionpoints, function (idx, graphic) {
                    map.graphics.add(graphic);
                });

                // create downloadable CSV
                var csv = csvTool.graphicsToCSV(predictionpoints);
                var encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
                $("#downloadLink").button().attr({ "href": encodedUri, "download": "prediction.csv" }).show();
            }
        }

    }
});


