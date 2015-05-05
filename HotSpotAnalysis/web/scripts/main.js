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
    "app/HotSpotTool",
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
    HotSpotTool, CSVTool
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
    
    var gpTool = new HotSpotTool(map, config.GPUrl);
    var csvTool = new CSVTool();

    var csvstring;
    var points;

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

    $("#calcButton").button().click(function () {
        if (typeof points != 'undefined' && points.length > 0) {
            $('#busy').show()
            gpTool.findHotspots(points, onAnalysisComplete);
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

    function onAnalysisComplete() {
        $("#legendDiv").show();
       $('#busy').hide()
    }    
});


