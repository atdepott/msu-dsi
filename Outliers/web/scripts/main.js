require([
    "esri/map",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Popup",
    "esri/graphic",
    "esri/graphicsUtils",
    "esri/Color",
    "dojo/parser", "dojo/on",
    "appConfig/defaults",
    "app/OutlierTool", "app/CSVTool",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer", "dojo/domReady!"
], function (
    Map,
    Legend,
    Scalebar,
    BasemapToggle, Popup,
    Graphic, graphicsUtils,
    Color,
    parser,on,
    config, 
    OutlierTool, CSVTool
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
    
    var gpTool = new OutlierTool(map, config.GPUrl);
    var csvTool = new CSVTool();

    var csvstring;
    var points;

    // create and hide legend
    var colorCell = $("#defaultLegendCell");
    var color = new Color([240, 255, 255, 1]);
    var canvas = $("<canvas/>").attr("width", 20).attr("height", 20).appendTo(colorCell);
    var ctx = canvas[0].getContext("2d");
    ctx.fillStyle = color.toHex();
    ctx.beginPath();
    ctx.arc(10, 10, 10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();

    colorCell = $("#outlierLegendCell");
    color = new Color([255, 0, 0, 1]);
    canvas = $("<canvas/>").attr("width", 20).attr("height", 20).appendTo(colorCell);
    ctx = canvas[0].getContext("2d");
    ctx.fillStyle = color.toHex();
    ctx.beginPath();
    ctx.arc(10, 10, 10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();

    $("#legendDiv").hide();
    
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

    $("#calcButton").button().click(function () {
        if (typeof points != 'undefined' && points.length > 0) {
            $('#busy').show()
            gpTool.findOutliers(points, onOutlierComplete);
        } else {
            alert("Please upload a file before completing your calculation.");
        }
    });
    
    $("#clearButton").button().click(function () {
        map.graphics.clear();
        points = undefined;
        $("#legendDiv").hide();

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

    function onOutlierComplete() {
        $("#legendDiv").hide();
       $('#busy').hide()
    }    
});


