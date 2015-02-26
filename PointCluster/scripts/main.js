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
    "app/ClusterTool", "app/CSVTool",
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
    ClusterTool, CSVTool
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

    var map = new Map("map", {
        basemap: "gray",
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
    
    var clusterTool = new ClusterTool(map, config.kNN_GPUrl);
    var csvTool = new CSVTool();

    var csvstring;
    var points;
    
    /*
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
    */

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

        // build select boxes in dialog
        var opts_lat = [];
        var opts_lon = [];
        var opts_val = [];
        var latidx = -1;
        var lonidx = -1;
        var validx = -1;
        $.each(headers, function (headername, headerIdx) {
            if (headername.toUpperCase() == "LATITUDE" ||
                headername.toUpperCase() == "LAT" ||
                headername.toUpperCase() == "Y") {
                latidx = headerIdx;
            } else if (headername.toUpperCase() == "LONGITUDE" ||
                headername.toUpperCase() == "LON" ||
                headername.toUpperCase() == "LONG" ||
                headername.toUpperCase() == "X") {
                lonidx = headerIdx;
            } else {
                validx = headerIdx;
            }

            opt = $("<option/>").text(headername).val(headerIdx);
            opts_lat.push(opt);
            opt = $("<option/>").text(headername).val(headerIdx);
            opts_lon.push(opt);
            opt = $("<option/>").text(headername).val(headerIdx);
            opts_val.push(opt);
        });
        $("#latNameInput").empty();
        $("#latNameInput").append(opts_lat);
        $("#lonNameInput").empty();
        $("#lonNameInput").append(opts_lon);
        $("#valNameInput").empty();
        $("#valNameInput").append(opts_val);

        if (latidx > -1) {
            $("#latNameInput").val(latidx);
        }
        if (lonidx > -1) {
            $("#lonNameInput").val(lonidx);
        }
        if (validx > -1) {
            $("#valNameInput").val(validx);
        }

        $("#csvDialog").dialog("open");
    }

    $("#knnButton").button().click(function () {
        if (typeof points != 'undefined' && points.length > 0) {
            $("#knnDialog").dialog("open");
        } else {
            alert("Please upload a file before completing clustering.");
        }
    });



    $("#clearButton").button().click(function () {
        map.graphics.clear();
        //$("#downloadButton").hide();
        points = undefined;
        $("#legendDiv").empty();

        // replace file uploader
        var control = $("#uploadFile");
        control.replaceWith(control.val('').clone(true));
    });
    
    

    $("#csvDialog").dialog({
        autoOpen: false,
        width: 200,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "OK": function () {
                var latIdx = $("#latNameInput").val();
                var lonIdx = $("#lonNameInput").val();
                var valIdx = $("#valNameInput").val();

                map.graphics.clear();
                points = csvTool.csvToGraphics(csvstring, latIdx, lonIdx, valIdx);
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

    $("#knnDialog").dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "Compute Clusters": function () {
                $('#busy').show()
                var numClusters = $("#knnNumberClusters").val();
                clusterTool.knnCluster(points, onClusterComplete, numClusters );

                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

   

    function onClusterComplete(url) {
       /* $("#downloadButton").button().click(function () {
            window.open(url);
        });
        $("#downloadButton").show();

        //fix transparency to match slider
        interpolationTool.updateTransparency($("#slider").slider("option", "value"));
       */
       $('#busy').hide()
    }

    $("#slider").slider({
        min: 0, max: 1, step: 0.01, value:0.8,
        change: function (event, ui) {
            interpolationTool.updateTransparency(ui.value);
        }
    });
/*
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
*/


    
});


