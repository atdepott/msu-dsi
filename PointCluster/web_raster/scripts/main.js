var clusterTool;

require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Popup",
    //"esri/toolbars/draw",
    //"esri/graphic",
    //"esri/graphicsUtils",
    //"esri/symbols/SimpleFillSymbol",
    "dojo/parser", "dojo/on",
    "appConfig/defaults",
    "app/ClusterTool",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer", "dojo/domReady!"
], function (
    Map,
    ArcGISDynamicMapServiceLayer,
    Legend,
    Scalebar,
    BasemapToggle,
    Popup,
    //Draw, Graphic, graphicsUtils,
    //SimpleFillSymbol,
    parser, on,
    config,
    ClusterTool
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
        basemap: "satellite",
        center: [36.8167, -1.2833],
        zoom: 8,
        infoWindow: infoWindow
    });

    var toggle = new BasemapToggle({
        map: map,
        basemap: "topo"
    }, "BasemapToggle");
    toggle.startup();

    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });

    clusterTool = new ClusterTool(map, config.kNN_GP_url, config.kNN_upload_url, config.kNN_MapService_url);

    map.on("layer-add", function (evt) {
        if (evt.layer.layerInfos[0].name != "World Imagery") {
            if (typeof legend == 'undefined') {
                // Add the legend
                legend = new Legend({
                    map: map,
                    layerInfos: [{ layer: evt.layer }]
                }, "legendDiv");
                legend.startup();
            } else {
                legend.refresh();
            }
        }
    });

    $("#knnButton").button().click(function () {
        $("#knnDialog").dialog("open")
    });

    $("#clearButton").button().click(function () {
        $("#downloadButton").hide();
        $("#legendDiv").empty();

        clusterTool.clear();

        // replace file uploader
        var control = $("#uploadFile");
        control.replaceWith(control.val('').clone(true));
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
                if (!isNaN(numClusters)) {
                    clusterTool.uploadFile('uploadform', function (itemid) {
                        if (typeof itemid == 'undefined') {
                            alert("Unable to upload file.  Please choose another file and try again.");
                        } else {
                            clusterTool.doCluster(itemid, numClusters, onClusterComplete);
                        }
                    });
                }

                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });



    function onClusterComplete(url) {
        $("#downloadButton").button().click(function () {
            window.open(url);
        });
        $("#downloadButton").show();

        //fix transparency to match slider
        clusterTool.updateTransparency($("#slider").slider("option", "value"));

        $('#busy').hide()
    }

    $("#slider").slider({
        min: 0, max: 1, step: 0.01, value:0.8,
        change: function (event, ui) {
            clusterTool.updateTransparency(ui.value);
        }
    });

});
