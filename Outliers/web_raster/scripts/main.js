var clusterTool;

require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    //"esri/dijit/Popup",
    //"esri/toolbars/draw",
    //"esri/graphic",
    //"esri/graphicsUtils",
    //"esri/symbols/SimpleFillSymbol",
    "dojo/parser", "dojo/on",
    "appConfig/defaults",
    "app/OutlierTool",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer", "dojo/domReady!"
], function (
    Map,
    ArcGISDynamicMapServiceLayer,
    Legend,
    Scalebar,
    BasemapToggle,
    //Popup,
    //Draw, Graphic, graphicsUtils,
    //SimpleFillSymbol,
    parser, on,
    config,
    OutlierTool
) {
    // call this here to ensure that map fills entire content pane
    parser.parse();

    esriConfig.defaults.io.proxyUrl = "http://dsidb.cse.msu.edu/proxy.ashx"
    esriConfig.defaults.io.alwaysUseProxy = false;

    // set application title
    document.title = config.title;
    $("#title").empty();
    $("#title").append(config.title);

    //var infoWindow = new Popup({}, "infowindow");
    //infoWindow.resize(100, 100);

    var map = new Map("map", {
        basemap: "topo",
        center: [36.8167, -1.2833],
        zoom: 8
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

    outlierTool = new OutlierTool(map, config.GP_url, config.upload_url, config.MapService_url);

    map.on("layer-add", function (evt) {
        //console.log(evt.layer);
        //if (evt.layer.layerInfos[0].name != "World Imagery") {
            if (typeof legend == 'undefined') {
                // Add the legend
                legend = new Legend({
                    map: map
                }, "legendDiv");
                legend.startup();
            } else {
                legend.refresh();
            }
        //}
    });

    $("#calcButton").button().click(function () {
        $('#busy').show()

        outlierTool.uploadFile('uploadform', function (itemid) {
            if (typeof itemid == 'undefined') {
                alert("Unable to upload file.  Please choose another file and try again.");
            } else {
                outlierTool.doOutlierAnalysis(itemid, onToolComplete);
            }
        });
        
    });

    $("#clearButton").button().click(function () {
        $("#downloadButton").hide();
        $("#legendDiv").empty();

        outlierTool.clear();

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
        outlierTool.updateTransparency($("#slider").slider("option", "value"));

        $('#busy').hide()
    }

    $("#slider").slider({
        min: 0, max: 1, step: 0.01, value:0.8,
        change: function (event, ui) {
            outlierTool.updateTransparency(ui.value);
        }
    });

});
