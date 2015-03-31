var clusterTool;

require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Popup",
    "dojo/parser", "dojo/on",
    "appConfig/defaults",
    "app/HotSpotTool",
    "dijit/layout/BorderContainer",
    "dojo/domReady!"
], function (
    Map,
    ArcGISDynamicMapServiceLayer,
    Legend,
    Scalebar,
    BasemapToggle,
    Popup,
    parser,
    on,
    config,
    HotSpotTool
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

    analysisTool = new HotSpotTool(map, config.GP_url, config.upload_url, config.MapService_url);

    //map.on("layer-add", function (evt) {
    //    if (typeof legend == 'undefined') {
    //        // Add the legend
    //        legend = new Legend({
    //            map: map
    //        }, "legendDiv");
    //        legend.startup();
    //    } else {
    //        legend.refresh();
    //    }
    //});

    $("#calcButton").button().click(function () {
        $('#busy').show()

        analysisTool.uploadFile('uploadform', function (itemid) {
            if (typeof itemid == 'undefined') {
                alert("Unable to upload file.  Please choose another file and try again.");
            } else {
                analysisTool.doHotSpotAnalysis(itemid, onToolComplete);
            }
        });
        
    });

    $("#clearButton").button().click(function () {
        $("#downloadButton").hide();
        $("#legendDiv").empty();

        analysisTool.clear();

        // replace file uploader
        var control = $("#uploadFile");
        control.replaceWith(control.val('').clone(true));
    });


    function onToolComplete(url) {
        $("#downloadButton").button().click(function () {
            window.open(url);
        });
        $("#downloadButton").show();

        //fix transparency to match slider
        analysisTool.updateTransparency($("#slider").slider("option", "value"));

        $('#busy').hide()
    }

    $("#slider").slider({
        min: 0, max: 1, step: 0.01, value:0.8,
        change: function (event, ui) {
            analysisTool.updateTransparency(ui.value);
        }
    });

});
