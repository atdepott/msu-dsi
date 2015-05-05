require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Popup",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/graphicsUtils",
    "esri/symbols/SimpleFillSymbol",
    "dojo/parser", "dojo/on",
    "appConfig/defaults",
    "app/InterpolationTool", "app/CSVTool",
    "app/RasterIdentify",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer", "dojo/domReady!"
], function (
    Map,
    ArcGISDynamicMapServiceLayer,
    Legend,
    Scalebar,
    BasemapToggle, Popup,
    Draw, Graphic, graphicsUtils,
    SimpleFillSymbol,
    parser,on,
    config, 
    InterpolationTool, CSVTool,
    RasterIdentify
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
    infoWindow.resize(100, 100);
    infoWindow.setTitle("VALUE");

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
    
    var interpolationTool = new InterpolationTool(map, 
            {
                idwGPUrl: config.idwInterpolationToolGPUrl,
                idwMapUrl: config.idwInterpolationToolMapUrl,
                nnGPUrl: config.nnInterpolationToolGPUrl,
                nnMapUrl: config.nnInterpolationToolMapUrl,
                splineGPUrl: config.splineInterpolationToolGPUrl,
                splineMapUrl: config.splineInterpolationToolMapUrl
            });
    var csvTool = new CSVTool();
    var rasterIdentify = new RasterIdentify(map);

    var csvstring;
    var points;
    var idwCellSize = -1;
    var idwPower = -1;
    var nnCellSize = -1;
    var splineCellSize = -1;

    map.on("layers-add-result", function (evt) {
        if (typeof legend == 'undefined') {
            // Add the legend
            legend = new Legend({
                map: map
            }, "legendDiv");
            legend.startup();
        } else {
            legend.refresh();
        }
    });

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
        $("#valNameInput").empty();
        $("#valNameInput").append(opts_val);

        // set default values, if we have them
        if (latfield != "") {
            $("#latNameInput").val(latfield);
        }
        if (lonfield != "") {
            $("#lonNameInput").val(lonfield);
        }

        $("#csvDialog").dialog("open");
    }

    //$("#idwButton").button().click(function () {
    //    if (typeof points != 'undefined' && points.length > 0) {
            
    //    } else {
    //        alert("Please upload a file before calculating surface.");
    //    }
    //});

    //$("#nnButton").button().click(function () {
    //    if (typeof points != 'undefined' && points.length > 0) {
    //        $("#nnDialog").dialog("open");
    //    } else {
    //        alert("Please upload a file before calculating surface.");
    //    }
    //});

    //$("#splineButton").button().click(function () {
    //    if (typeof points != 'undefined' && points.length > 0) {
    //        $("#splineDialog").dialog("open");
    //    } else {
    //        alert("Please upload a file before calculating surface.");
    //    }
    //});

    $("#doInterpolationButton").button().click(function () {
        if (typeof points != 'undefined' && points.length > 0) {
            if (config.interpolationType == 'IDW') {
                $("#idwDialog").dialog("open");
            } else if (config.interpolationType == 'NN') {
                $("#nnDialog").dialog("open");
            } else if (config.interpolationType == 'SPLINE') {
                $("#splineDialog").dialog("open");
            } else {
                alert("Configuration error - " + config.interpolationType + " is not defined.");
            }
        } else {
            alert("Please upload a file before calculating surface.");
        }
    });

    $("#clearButton").button().click(function () {
        map.graphics.clear();
        interpolationTool.clear();
        $("#downloadButton").hide();
        points = undefined;
        idwCellSize = -1;
        idwPower = -1;

        // replace file uploader
        var control = $("#uploadFile");
        control.replaceWith(control.val('').clone(true));

        rasterIdentify.stop();
    });

    $("#clearPointsButton").button().click(function () {
        map.graphics.clear();
    });

    $("#downloadFile").attr("href", config.sampleFile);
    //console.log(config.sampleFile);

    $("#csvDialog").dialog({
        autoOpen: false,
        width: 200,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "OK": function () {
                var latField = $("#latNameInput").val();
                var lonField = $("#lonNameInput").val();
                var valField = $("#valNameInput").val();

                map.graphics.clear();
                points = csvTool.csvToGraphics(csvstring, latField, lonField, valField);
                map.setExtent(graphicsUtils.graphicsExtent(points));
                $.each(points, function (idx, graphic) {
                    map.graphics.add(graphic);
                });

                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    $("#idwDialog").dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "Create Surface": function () {
                if (idwCellSize <= 0) {
                    idwCellSize = undefined;
                }

                if (idwPower <= 0) {
                    idwPower = undefined;
                }

                $("#busy").show();
                interpolationTool.createIDWSurface(points, onSurfaceComplete, idwCellSize, idwPower);

                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    $("#nnDialog").dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "Create Surface": function () {
                if (nnCellSize <= 0) {
                    nnCellSize = undefined;
                }

                $("#busy").show();
                interpolationTool.createNNSurface(points, onSurfaceComplete, nnCellSize);

                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    $("#splineDialog").dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "Create Surface": function () {
                if (splineCellSize <= 0) {
                    splineCellSize = undefined;
                }

                $("#busy").show();
                interpolationTool.createSplineSurface(points, onSurfaceComplete, splineCellSize);

                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    function onSurfaceComplete(url, layer) {
        $("#busy").hide();

        $("#downloadButton").button().click(function () {
            window.open(url);
        });
        $("#downloadButton").show();

        //fix transparency to match slider
        interpolationTool.updateTransparency($("#slider").slider("option", "value"));

        rasterIdentify.start(layer.url, [0]);
    }

    $("#slider").slider({
        min: 0, max: 1, step: 0.01, value:0.8,
        change: function (event, ui) {
            interpolationTool.updateTransparency(ui.value);
        }
    });

    //console.log(config.interpolationHtml);
    $("#interpolationDescripDiv").html(config.interpolationHtml);

    //deal with form inputs
    $("#idwCellSizeUseDefault").change(function () {
        if ($(this).is(":checked")) {
            idwCellSize = -1;
            $("#idwCellSizeInput").prop("disabled", true);
        } else {
            $("#idwCellSizeInput").prop("disabled", false);
            idwCellSize = $("#idwCellSizeInput").val();
        }
    });

    $("#idwPowerUseDefault").change(function () {
        if ($(this).is(":checked")) {
            idwPower = -1;
            $("#idwPowerInput").prop("disabled", true);
        } else {
            $("#idwPowerInput").prop("disabled", false);
            idwPower = $("#idwPowerInput").val();
        }
    });

    $("#idwCellSizeInput").change(function () {
        if (isNaN($(this).val())) {
            $(this).val("");
            idwCellSize = -1;
        } else {
            idwCellSize = $(this).val();
        }
    });

    $("#idwPowerInput").change(function () {
        if (isNaN($(this).val())) {
            $(this).val("");
            idwPower = -1;
        } else {
            idwPower = $(this).val();
        }
    });

    $("#nnCellSizeUseDefault").change(function () {
        if ($(this).is(":checked")) {
            nnCellSize = -1;
            $("#nnCellSizeInput").prop("disabled", true);
        } else {
            $("#nnCellSizeInput").prop("disabled", false);
            nnCellSize = $("#nnCellSizeInput").val();
        }
    });

    $("#nnCellSizeInput").change(function () {
        if (isNaN($(this).val())) {
            $(this).val("");
            nnCellSize = -1;
        } else {
            nnCellSize = $(this).val();
        }
    });

    $("#splineCellSizeUseDefault").change(function () {
        if ($(this).is(":checked")) {
            splineCellSize = -1;
            $("#splineCellSizeInput").prop("disabled", true);
        } else {
            $("#splineCellSizeInput").prop("disabled", false);
            splineCellSize = $("#splineCellSizeInput").val();
        }
    });

    $("#splineCellSizeInput").change(function () {
        if (isNaN($(this).val())) {
            $(this).val("");
            splineCellSize = -1;
        } else {
            splineCellSize = $(this).val();
        }
    });

    
});



